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
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
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

const NlmtSettlementClosure = () => {
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
  // const [screenAccess, setScreenAccess] = useState(false)
  // const [restrictScreenById, setRestrictScreenById] = useState(true)
  // let page_no = LogisticsProScreenNumberConstants.TripSettlementScreens.Tripsheet_Expense_Closure

  // useEffect(()=>{

  //   if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
  //     //console.log('screen-access-allowed')
  //     setScreenAccess(true)
  //   } else{
  //     //console.log('screen-access-not-allowed')
  //     setScreenAccess(false)
  //   }

  // },[])
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
    fci_atti_cooli_charges: '',
    fci_extra_charges: '',
    fci_office_exp_charges: '',
    fci_gate_exp_charges: '',
    fci_weighment_charges: '',
    fci_vendor_type: '',
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

    TdsHaving: '',
    TdsType: '',
    halt_days: '',
    cost_center: '',
    ded_remarks: '',
    deduction_doc: '',
    GSTtax: '',
    HSNtax: '',
    sap_text: '',
    ot_process_type: '',
    ot_vr_id: '',
    incoterm_freight_info: '',
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
  const getCostCenterName = (id) => {
    if (!costCenterData || !id) return ''

    const item = costCenterData.find((x) => String(x.definition_list_id) === String(id))

    return item ? item.definition_list_name : ''
  }
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

    DieselVendorMasterService.getDieselVendors().then((response) => {
      let viewData = response.data.data
      //console.log(viewData, 'getDieselVendors')
      setDvData(viewData)
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
  const handleChangepostingDate = (event) => {
    let vall = event.target.value

    setpostingDate(vall) // local state (optional)

    values.ded_posting_date = vall // ✅ IMPORTANT
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
          setpostingDate(res.data.data[0]?.ded_posting_date ?? '')
          values.ded_posting_date = res.data.data[0]?.ded_posting_date ?? ''
          setdeductionDoc(res.data.data[0]?.deduction_doc ?? '')
          values.deduction_doc = res.data.data[0]?.deduction_doc ?? ''

          setTdsType(res.data.data[0]?.tds_type ?? '')
          values.TdsType = res.data.data[0]?.tds_type ?? ''

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
          console.log(values.cost_center, 'values.cost_center')
          console.log(values.ded_posting_date, 'values.ded_posting_date')
          console.log(values.ded_remarks, 'values.ded_remarks')
        }
      })

      NlmtVehicleAssignmentService.getShipmentInfoByPId(id).then((res) => {
        //console.log(res.data.data)
        let shipment_data = res.data.data || []
        setTripFgsalesData(shipment_data)
      })

      NlmtRJSaleOrderCreationService.getRJSaleOrderbyParkingId(id).then((res) => {
        //console.log(res.data.data)
        if (res.data.data) {
          setTripRjsoData(res.data.data)
          setRjsoInfo(res.data.data)
        }
      })

      NlmtRJSaleOrderCreationService.getWaitingRJRequestsbyParkingId(id).then((res) => {
        //console.log(res.data.data, 'getWaitingRJRequestsbyParkingId')
        setRjRequestsInfo(res.data.data)
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
          fetchedData.trip_vehicle_info &&
          fetchedData.trip_vehicle_info.vehicle_type_id == 22 &&
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
          fetchedData.trip_vehicle_info &&
          fetchedData.trip_vehicle_info.vehicle_type_id == 23 &&
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
        if (Number(fetchedData.trip_vehicle_info.vehicle_type_id) === 22) {
          setMainKey(1) // Hire Section
        } else if (Number(fetchedData.trip_vehicle_info.vehicle_type_id) === 21) {
          setMainKey(2) // Own Section
        } else if (Number(fetchedData.trip_vehicle_info.vehicle_type_id) === 23) {
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

    if (tripInfo.rj_so_info && tripInfo.rj_so_info.length > 0) {
      let rjso_expenses =
        Number(data.rjso_tarpaulin_charges ? data.rjso_tarpaulin_charges : 0) +
        Number(data.rjso_weighment_charges ? data.rjso_weighment_charges : 0) +
        Number(data.rjso_unloading_charges ? data.rjso_unloading_charges : 0) +
        Number(data.rjso_loading_charges ? data.rjso_loading_charges : 0) +
        Number(data.rjso_bata_amount ? data.rjso_bata_amount : 0) +
        Number(data.rjso_commision_charges ? data.rjso_commision_charges : 0) +
        Number(data.rjso_misc_charges ? data.rjso_misc_charges : 0) +
        Number(data.rjso_munic_charges ? data.rjso_munic_charges : 0) +
        Number(data.rjso_halt_charges ? data.rjso_halt_charges : 0) +
        Number(data.rjso_en_diesel_charges ? data.rjso_en_diesel_charges : 0)
      //console.log(rjso_expenses, 'rjso_expenses')
      total_charge = total_charge + rjso_expenses
    }

    if (tripInfo && stoTableDataFCI && stoTableDataFCI.length > 0) {
      let fci_expenses =
        Number(data.fci_atti_cooli_charges ? data.fci_atti_cooli_charges : 0) +
        Number(data.fci_extra_charges ? data.fci_extra_charges : 0) +
        Number(data.fci_office_exp_charges ? data.fci_office_exp_charges : 0) +
        Number(data.fci_gate_exp_charges ? data.fci_gate_exp_charges : 0) +
        Number(data.fci_weighment_charges ? data.fci_weighment_charges : 0)
      //console.log(fci_expenses, 'fci_expenses')
      total_charge = total_charge + fci_expenses
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
    // values.fci_atti_cooli_charges,
    // values.fci_extra_charges,
    // values.fci_office_exp_charges,
    // values.fci_gate_exp_charges,
    // values.fci_weighment_charges,
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
  const [stoDeliveryInvalidRMSTO, setStoDeliveryInvalidRMSTO] = useState(true)
  const [stoDeliveryInvalidFCI, setStoDeliveryInvalidFCI] = useState(true)

  const [stoValuesRMSTO, setStoValuesRMSTO] = useState(
    TripsheetClosureConstants.stoInitialStateRMSTO
  )

  const [stoValuesFCI, setStoValuesFCI] = useState(TripsheetClosureConstants.stoInitialStateFCI)

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
  const [fciAvailable, setFciAvailable] = useState(false)

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
      tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id == 22 ? true : false
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

  const handleStoValueChange = (event) => {
    let value_change = event.target.value
    if (
      event.target.name == 'sto_delivery_number' ||
      event.target.name == 'sto_po_number' ||
      event.target.name == 'sto_delivery_division' ||
      event.target.name == 'sto_freight_amount'
    ) {
      value_change = event.target.value.replace(/\D/g, '')
    } else if (event.target.name == 'sto_from_location' || event.target.name == 'sto_to_location') {
      value_change = event.target.value.replace(/[^a-zA-Z ]/gi, '')
    } else if (event.target.name == 'sto_delivery_quantity') {
      value_change = event.target.value
        .replace(/[^0-9^\.]+/g, '')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^0+/, '')
    }
    let updatedinputs = { ...stoValues, [event.target.name]: value_change }
    setStoValues(updatedinputs)
    addEnable(updatedinputs)
  }

  const handleStoExpenseCaptureChange = (event) => {
    let updatedinputs = { ...stoValues, [event.target.name]: event.target.checked }
    setStoValues(updatedinputs)
    //console.log(stoValues)
    //console.log(stoTableData)
  }

  const assignFGSTOData = (sap) => {
    //console.log(sap)

    let updatedTable = []

    sap.map((sap_val, sap_ind) => {
      let updatedinputs = {}
      let sto_delivery_number_fgsto = sap_val.VBELN
      let sto_po_number_fgsto = sap_val.EBELN
      let sto_delivery_division_fgsto = sap_val.DIVISION
      let sto_from_location_fgsto = sap_val.RESWK
      let sto_to_location_fgsto = sap_val.WERKS
      let sto_delivery_quantity_fgsto = sap_val.LFIMG
      let sto_freight_amount_fgsto = sap_val.KBETR
      let sto_pod_copy_fgsto_file_upload = false

      updatedinputs = {
        sto_delivery_number_fgsto,
        sto_po_number_fgsto,
        sto_delivery_division_fgsto,
        sto_from_location_fgsto,
        sto_to_location_fgsto,
        sto_delivery_quantity_fgsto,
        sto_freight_amount_fgsto,
        sto_pod_copy_fgsto_file_upload,
      }

      updatedTable.push(updatedinputs)
    })

    setStoValuesFGSTO(updatedTable)
    setStoTableDataFGSTO(updatedTable)
  }

  const assignSTOData = (sap) => {
    //console.log(sap)
    toast.success('STO Delivery Details Detected!')
    let updatedinputs = {}

    let sto_po_number = sap.EBELN
    let sto_delivery_division = sap.DIVISION
    let sto_from_location = sap.RESWK
    let sto_to_location = sap.WERKS
    let sto_delivery_quantity = sap.LFIMG
    let sto_freight_amount = sap.KBETR

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
    // stoValues.push(stoSapData)
    setStoValues(updatedinputs)
    addEnable(updatedinputs)
  }

  const fciExpenseFinder = (data, type) => {
    let needed_val = 0

    //console.log(data, 'fciExpenseFinder-data')
    //console.log(type, 'fciExpenseFinder-type')

    if (type == 1) {
      data.map((vk, kk) => {
        if (vk.STATUS == 2) {
          needed_val = needed_val + vk.ATTI_COOLI
        }
      })
    } else if (type == 2) {
      data.map((vk, kk) => {
        if (vk.STATUS == 2) {
          needed_val = needed_val + vk.EXTRA_CHARGE
        }
      })
    } else if (type == 3) {
      data.map((vk, kk) => {
        if (vk.STATUS == 2) {
          needed_val = needed_val + vk.OFFICE_EXPENSE
        }
      })
    } else if (type == 4) {
      data.map((vk, kk) => {
        if (vk.STATUS == 2) {
          needed_val = needed_val + vk.GATE_EXPENSE
        }
      })
    } else if (type == 5) {
      data.map((vk, kk) => {
        if (vk.STATUS == 2) {
          needed_val = needed_val + vk.WEIGHTMENT_CHARGE
        }
      })
    } else if (type == 6) {
      data.map((vk, kk) => {
        needed_val = vk.STATUS
      })
    }

    //console.log(needed_val, 'needed_val', type)

    return needed_val
  }

  const assignFCIData = (sap) => {
    //console.log(sap, 'assignFCIData')
    toast.success('FCI Delivery Details Detected!')
    // let updatedinputs = {}
    let updatedinputs = {}
    let updatedTable = []
    values.fci_atti_cooli_charges = fciExpenseFinder(sap, 1)
    values.fci_extra_charges = fciExpenseFinder(sap, 2)
    values.fci_office_exp_charges = fciExpenseFinder(sap, 3)
    values.fci_gate_exp_charges = fciExpenseFinder(sap, 4)
    values.fci_weighment_charges = fciExpenseFinder(sap, 5)
    values.fci_vendor_type = fciExpenseFinder(sap, 6)
    sap.map((sap_val, sap_ind) => {
      let updatedinputs = {}
      let sto_po_number_fci = sap_val.EBELN
      let sto_delivery_division_fci = sap_val.DIVISION
      let sto_from_location_fci = sap_val.FROM_PLANT
      let sto_to_location_fci = sap_val.TO_PLANT
      let sto_delivery_quantity_fci = sap_val.LFIMG
      let sto_base_freight_amount_fci = sap_val.KBETR
      let sto_migo_number_fci = sap_val.MIGO_NO
      let sto_va_number_fci = sap_val.VA_NO
      let sto_driver_name_fci = sap_val.DRIVER_NAME
      let sto_vendor_status_fci = sap_val.STATUS

      updatedinputs = {
        sto_po_number_fci,
        sto_delivery_division_fci,
        sto_from_location_fci,
        sto_to_location_fci,
        sto_delivery_quantity_fci,
        sto_base_freight_amount_fci,
        sto_migo_number_fci,
        sto_va_number_fci,
        sto_driver_name_fci,
        sto_vendor_status_fci,
      }

      updatedTable.push(updatedinputs)
    })
    if (sap.length > 0) {
      setFciAvailable(true)
      setTabFCISuccess(true)
    } else {
      setFciAvailable(false)
      setTabFCISuccess(false)
    }
    setStoValuesFCI(updatedTable)
    setStoTableDataFCI(updatedTable)
  }

  const assignRMSTOData = (sap) => {
    //console.log(sap)
    toast.success('RMSTO Delivery Details Detected!')
    // let updatedinputs = {}
    let updatedinputs = {}
    let updatedTable = []
    sap.map((sap_val, sap_ind) => {
      let updatedinputs = {}
      let sto_delivery_number_rmsto = sap_val.VBELN
      let sto_po_number_rmsto = sap_val.EBELN
      let sto_delivery_division_rmsto = sap_val.DIVISION
      let sto_from_location_rmsto = sap_val.RESWK
      let sto_to_location_rmsto = sap_val.WERKS
      let sto_delivery_quantity_rmsto = sap_val.LFIMG
      let sto_freight_amount_rmsto = sap_val.KBETR
      let sto_migo_number_rmsto = sap_val.MIGO_NO
      let sto_va_number_rmsto = sap_val.VA_NO
      let sto_fnr_number_rmsto = sap_val.FNR_NO
      let sto_driver_name_rmsto = sap_val.DRIVER_NAME
      let sto_pod_copy_rmsto_file_upload = false

      updatedinputs = {
        sto_delivery_number_rmsto,
        sto_po_number_rmsto,
        sto_delivery_division_rmsto,
        sto_from_location_rmsto,
        sto_to_location_rmsto,
        sto_delivery_quantity_rmsto,
        sto_freight_amount_rmsto,
        sto_migo_number_rmsto,
        sto_va_number_rmsto,
        sto_fnr_number_rmsto,
        sto_driver_name_rmsto,
        sto_pod_copy_rmsto_file_upload,
      }

      updatedTable.push(updatedinputs)
    })
    if (sap.length > 0) {
      setRmstoAvailable(true)
      setTabRMSTOSuccess(false)
    } else {
      setRmstoAvailable(false)
      setTabRMSTOSuccess(true)
    }
    setStoValuesRMSTO(updatedTable)
    setStoTableDataRMSTO(updatedTable)
  }

  const handleStoFileUploadChange = (event) => {
    //console.log(event.target)
    let uploaded_file_path = URL.createObjectURL(event.target.files[0])
    // let uploaded_file_path = event.target.files[0]
    setFilePath(uploaded_file_path)
    setStoFileUploadVisible(false)
    let updatedinputs = { ...stoValues, [event.target.name]: uploaded_file_path }
    setStoValues(updatedinputs)
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

  const stoPodUploadResetEditRMSTO = () => {
    //console.log(stoValuesRMSTO.sto_pod_copy_rmsto)
    stoValuesRMSTO.sto_pod_copy_rmsto = ''
    setStoFileUploadVisibleRMSTO(true)
  }

  const onStoEditcallbackRMSTO = (index) => {
    setStoDeliveryEditRMSTO(true)
    setIsStoEditModeRMSTO(true)
    //console.log(index)
    //console.log(deliveryNoDeleteRMSTO)
    setStoEditIndexRMSTO(index)
    setStoFileUploadVisibleRMSTO(false)
    //console.log(stoTableDataRMSTO[index])
    setStoValuesRMSTO(stoTableDataRMSTO[index])
  }

  const removeStoFieldsRMSTO = (index) => {
    setDeliveryDeleteRMSTO(false)
    setStoDeliveryEditRMSTO(false)
    const updatedData = [...stoTableDataRMSTO]
    updatedData.splice(index, 1)
    setStoTableDataRMSTO(updatedData)
    setDeliveryNoDeleteRMSTO('')
    setDeliveryNoDeleteIndexRMSTO('')
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

  const addEnableRMSTO = (data) => {
    //console.log(data)
    let hire_vehicle_check_rmsto =
      tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id == 22 ? true : false
    if (
      data.sto_delivery_number_rmsto != '' &&
      data.sto_po_number_rmsto != '' &&
      data.sto_delivery_division_rmsto != '' &&
      data.sto_from_location_rmsto != '' &&
      data.sto_to_location_rmsto != '' &&
      data.sto_delivery_quantity_rmsto != '' &&
      data.sto_freight_amount_rmsto != '' &&
      data.sto_delivery_date_time_rmsto != '' &&
      data.sto_pod_copy_rmsto != ''
      //  && (data.sto_delivery_driver_name_rmsto != '' || hire_vehicle_check_rmsto)
    ) {
      setStoDeliveryInvalidRMSTO(false)
      return true
    } else {
      setStoDeliveryInvalidRMSTO(true)
      return false
    }
  }

  const addEnableFCI = (data) => {
    //console.log(data)
    if (
      data.sto_po_number_fci != '' &&
      data.sto_delivery_division_fci != '' &&
      data.sto_delivery_quantity_fci != '' &&
      data.sto_base_freight_amount_fci != '' &&
      data.sto_migo_number_fci != '' &&
      data.sto_va_number_fci != ''
    ) {
      setStoDeliveryInvalidFCI(false)
      return true
    } else {
      setStoDeliveryInvalidFCI(true)
      return false
    }
  }

  const handleStoValueChangeRMSTO = (event, key) => {
    let value_change = event.target.value
    //console.log(value_change, 'value_change')
    // 1. Make a shallow copy of the items
    let items = [...stoValuesRMSTO]
    // 2. Make a shallow copy of the item you want to mutate
    let item = { ...items[key] }
    // 3. Replace the property you're intested in
    if (event.target.name == 'sto_delivery_date_time_rmsto') {
      item.sto_delivery_date_time_rmsto = value_change
    } else if (event.target.name == 'sto_pod_copy_rmsto') {
      item.sto_pod_copy_rmsto = value_change
    }

    // 4. Put it back into our array. N.B. we *are* mutating the array here,
    //    but that's why we made a copy first
    items[key] = item
    // 5. Set the state to our new copy

    //console.log(items)
    setStoValuesRMSTO(items)
    setStoTableDataRMSTO(items)

    //console.log(value_change, 'value_change')
    //console.log(expensesData, 'ExpensesData')
    let up1 = { ...stoValuesRMSTO[key], [event.target.name]: value_change }
    let up2 = { ...stoValuesRMSTO, up1 }
    let updatedinputs = { ...stoValuesRMSTO, [event.target.name]: value_change }
    let updatedinputs123 = { ...stoValuesRMSTO, [event.target.name]: value_change }
    //console.log(stoValuesRMSTO, 'stoValuesRMSTO')
    //console.log(updatedinputs, 'updatedinputs')
    //console.log(up1, 'up1')
    //console.log(up2, 'up2')
    // setStoValuesRMSTO(updatedinputs)
    // setStoValuesRMSTO(up1)
    setExpensesData(updatedinputs123)
    // addEnableRMSTO(updatedinputs)
    //console.log(stoValuesRMSTO, 'stoValuesRMSTO')
    //console.log(expensesData, 'ExpensesData')
  }

  const handleStoValueChangeFGSTO = (event, key) => {
    let value_change = event.target.value
    //console.log(value_change, 'value_change')
    // 1. Make a shallow copy of the items
    let items = [...stoValuesFGSTO]
    // 2. Make a shallow copy of the item you want to mutate
    let item = { ...items[key] }
    // 3. Replace the property you're intested in
    if (event.target.name == 'sto_delivery_date_time_fgsto') {
      item.sto_delivery_date_time_fgsto = value_change
    } else if (event.target.name == 'sto_pod_copy_fgsto') {
      item.sto_pod_copy_fgsto = value_change
    }

    // 4. Put it back into our array. N.B. we *are* mutating the array here,
    //    but that's why we made a copy first
    items[key] = item
    // 5. Set the state to our new copy

    //console.log(items)
    setStoValuesFGSTO(items)
    setStoTableDataFGSTO(items)

    //console.log(value_change, 'value_change')
    //console.log(expensesData, 'ExpensesData')
    let up1 = { ...stoValuesFGSTO[key], [event.target.name]: value_change }
    let up2 = { ...stoValuesFGSTO, up1 }
    let updatedinputs = { ...stoValuesFGSTO, [event.target.name]: value_change }
    let updatedinputs123 = { ...stoValuesFGSTO, [event.target.name]: value_change }
    //console.log(stoValuesFGSTO, 'stoValuesRMSTO')
    //console.log(updatedinputs, 'updatedinputs')
    //console.log(up1, 'up1')
    //console.log(up2, 'up2')
    // setStoValuesRMSTO(updatedinputs)
    // setStoValuesRMSTO(up1)
    setExpensesData(updatedinputs123)
    // addEnableRMSTO(updatedinputs)
    //console.log(stoValuesFGSTO, 'stoValuesRMSTO')
    //console.log(expensesData, 'ExpensesData')
  }

  // const handleStoExpenseCaptureChangeRMSTO = (event) => {
  //   let updatedinputs = { ...stoValuesRMSTO, [event.target.name]: event.target.checked }
  //   setStoValuesRMSTO(updatedinputs)
  //   //console.log(stoValuesRMSTO)
  //   //console.log(stoTableDataRMSTO)
  // }

  const handleStoFileUploadChangeRMSTO = (event, key) => {
    // let value_change = event.target.value
    //console.log(event, 'event')
    // let uploaded_file_path_rmsto = URL.createObjectURL(event.target.files[0])
    // let uploaded_file_path_rmsto = imageCompress(event)
    // //console.log(uploaded_file_path_rmsto,'uploaded_file_path_rmsto')

    // 1. Make a shallow copy of the items
    let items = [...stoValuesRMSTO]
    // 2. Make a shallow copy of the item you want to mutate
    let item = { ...items[key] }
    // 3. Replace the property you're intested in
    if (event.target.name == 'sto_pod_copy_rmsto') {
      // item.sto_pod_copy_rmsto = uploaded_file_path_rmsto
      item.sto_pod_copy_rmsto_file_upload = true
      imageCompress(event, item, 'rmsto')
    }

    // 4. Put it back into our array. N.B. we *are* mutating the array here,
    //    but that's why we made a copy first
    items[key] = item
    // 5. Set the state to our new copy

    //console.log(items)
    setStoValuesRMSTO(items)
    setStoTableDataRMSTO(items)
    // //console.log(event.target)
    // // let uploaded_file_path_rmsto = URL.createObjectURL(event.target.files[0])
    // // let uploaded_file_path_rmsto = event.target.files[0]
    // setFilePathRMSTO(uploaded_file_path_rmsto)
    // setStoFileUploadVisibleRMSTO(false)
    // let updatedinputs_rmsto = { ...stoValuesRMSTO, [event.target.name]: uploaded_file_path_rmsto }
    // setStoValuesRMSTO(updatedinputs_rmsto)
  }

  /* FCI Value Update */

  const handleStoFileUploadChangeFci = (event, key) => {
    //console.log(event, 'event')

    // 1. Make a shallow copy of the items
    let items = [...stoValuesFCI]
    // 2. Make a shallow copy of the item you want to mutate
    let item = { ...items[key] }
    // 3. Replace the property you're intested in
    if (event.target.name == 'sto_pod_copy_fci') {
      item.sto_pod_copy_fci_file_upload = true
      let file = event.target.files[0]
      if (file.size > 5000000) {
        alert('File is too Big, please select a file less than 5mb')
        item.sto_pod_copy_fci_file_upload = false
        item.sto_pod_copy_fci = file
        return false
      } else {
        item.sto_pod_copy_fci = file
      }
      // imageCompress(event,item,'fci')
    }

    // 4. Put it back into our array. N.B. we *are* mutating the array here,
    //    but that's why we made a copy first
    items[key] = item
    // 5. Set the state to our new copy

    //console.log(items, 'handleStoFileUploadChangeFci-items')
    setStoValuesFCI(items)
    setStoTableDataFCI(items)
  }

  const handleStoValueChangeFci = (event, key) => {
    let value_change = event.target.value
    //console.log(value_change, 'value_change')
    // 1. Make a shallow copy of the items
    let items = [...stoValuesFCI]
    // 2. Make a shallow copy of the item you want to mutate
    let item = { ...items[key] }
    // 3. Replace the property you're intested in
    if (event.target.name == 'sto_delivery_date_time_fci') {
      item.sto_delivery_date_time_fci = value_change
    }
    // else if (event.target.name == 'sto_pod_copy_rmsto') {
    //   item.sto_pod_copy_rmsto = value_change
    // }

    // 4. Put it back into our array. N.B. we *are* mutating the array here,
    //    but that's why we made a copy first
    items[key] = item
    // 5. Set the state to our new copy

    //console.log(items)
    setStoValuesFCI(items)
    setStoTableDataFCI(items)
  }

  const changeFciTableItemForDCC = (event, child_property_name, parent_index, arpl = '') => {
    let getData3 = event.target.value

    if (child_property_name == 'diesel_cons_qty_ltr') {
      getData3 = event.target.value
        .replace(/[^0-9^\.]+/g, '')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^0+/, '')
    } else if (child_property_name == 'closing_km' || child_property_name == 'opening_km') {
      getData3 = event.target.value.replace(/\D/g, '')
    }

    const fci_parent_info = JSON.parse(JSON.stringify(stoTableDataFCI))

    if (child_property_name == 'diesel_cons_qty_ltr') {
      fci_parent_info[parent_index][`${child_property_name}_input`] = getData3
      fci_parent_info[parent_index][`diesel_amount_input`] = Math.round(getData3 * arpl)
    } else if (child_property_name == 'opening_km') {
      fci_parent_info[parent_index][`${child_property_name}_input`] = getData3
      fci_parent_info[parent_index][`running_km_input`] = fci_parent_info[parent_index][
        `closing_km_input`
      ]
        ? Number(fci_parent_info[parent_index][`closing_km_input`]) - Number(getData3)
        : ''
    } else if (child_property_name == 'closing_km') {
      fci_parent_info[parent_index][`${child_property_name}_input`] = getData3
      fci_parent_info[parent_index][`running_km_input`] = fci_parent_info[parent_index][
        `opening_km_input`
      ]
        ? Number(getData3) - Number(fci_parent_info[parent_index][`opening_km_input`])
        : ''
    } else {
      fci_parent_info[parent_index][`${child_property_name}_input`] = getData3
    }

    setStoTableDataFCI(fci_parent_info)
  }

  //console.log(stoTableDataRMSTO)

  const fciDataUpdateForDCC = (original, input) => {
    return input === undefined ? original : input
  }

  // const tripPurposeFinder = (code) => {
  //   let p_code = '-'
  //   if (code == '1') {
  //     p_code = 'FG-SALES'
  //   } else if (code == '2') {
  //     p_code = 'FG-STO'
  //   } else if (code == '3') {
  //     p_code = 'RM-STO'
  //   } else if (code == '4') {
  //     p_code = 'OTHERS'
  //   } else if (code == '5') {
  //     p_code = 'FCI'
  //   }
  //   return p_code
  // }

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
    } else if (ftype == 'fci') {
      need_data.sto_pod_copy_fci_file_name = file.name
      if (file.type == 'application/pdf') {
        if (file.size > 5000000) {
          alert('File too Big, please select a file less than 5mb')
          need_data.sto_pod_copy_fci_file_upload = false
          need_data.sto_pod_copy_fci = file
          return false
        } else {
          need_data.sto_pod_copy_fci = file
        }
      } else {
        //console.log(file, 'filename')
        //console.log(file.type, 'filename')

        const image = await resizeFile(file)

        if (file.size > 2000000) {
          valueAppendToImage(image, need_data, 'fci')
        } else {
          need_data.sto_pod_copy_fci = file
        }
      }
    } else if (ftype == 'fjsales') {
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
    } else if (ftype == 'rjso') {
      const rjso_parent_info_for_rjso = JSON.parse(JSON.stringify(rjsoInfo))

      rjso_parent_info_for_rjso[need_data].rj_pod_copy_file_name = file.name

      if (file.type == 'application/pdf') {
        if (file.size > 5000000) {
          alert('File too Big, please select a file less than 5mb')
          rjso_parent_info_for_rjso[need_data].rj_pod_copy_file_upload = false
          return false
        } else {
          rjso_parent_info_for_rjso[need_data].rj_pod_copy = file
        }
      } else {
        //console.log(file, 'filename')
        //console.log(file.type, 'filename')

        const image = await resizeFile(file)

        if (file.size > 2000000) {
          valueAppendToImage(image, rjso_parent_info_for_rjso[need_data], 'rjso')
        } else {
          rjso_parent_info_for_rjso[need_data].rj_pod_copy = file
        }
      }

      setRjsoInfo(rjso_parent_info_for_rjso)
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

    if (ftype == 'rmsto') {
      if (need_data) {
        need_data.sto_pod_copy_rmsto = file
      }
    } else if (ftype == 'fci') {
      if (need_data) {
        need_data.sto_pod_copy_fci = file
      }
    } else if (ftype == 'fjsales') {
      if (need_data) {
        need_data.fj_pod_copy = file
      }
    } else if (ftype == 'rjso') {
      if (need_data) {
        need_data.rj_pod_copy = file
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

  /* Remove FCI DETAILS */
  const emptyFCIData = () => {
    let updatedinputs = {}

    let sto_po_number_fci = ''
    let sto_delivery_division_fci = ''
    let sto_from_location_fci = ''
    let sto_to_location_fci = ''
    let sto_delivery_quantity_fci = ''
    let sto_base_freight_amount_fci = ''
    let sto_migo_number_fci = ''
    let sto_va_number_fci = ''

    updatedinputs = {
      ...stoValuesFCI,
      sto_po_number_fci,
      sto_delivery_division_fci,
      sto_from_location_fci,
      sto_to_location_fci,
      sto_delivery_quantity_fci,
      sto_base_freight_amount_fci,
      sto_migo_number_fci,
      sto_va_number_fci,
    }

    values.fci_atti_cooli_charges = 0
    values.fci_extra_charges = 0
    values.fci_office_exp_charges = 0
    values.fci_gate_exp_charges = 0
    values.fci_weighment_charges = 0

    //console.log(updatedinputs)

    setStoValuesFCI(updatedinputs)
    addEnableFCI(updatedinputs)
  }

  const [rjCustomerData, setRjCustomerData] = useState([])

  /* section for getting RJ Customer Details from database */
  useEffect(() => {
    CustomerCreationService.getCustomerCreationData().then((res) => {
      //console.log(res.data.data, 'setRjCustomerData')
      setRjCustomerData(res.data.data)
    })
  }, [])

  const rjcustomerCodeToname = (code) => {
    let customer_name = ''
    rjCustomerData.map((val, key) => {
      if (val.customer_code == code) {
        customer_name = val.customer_name
      }
    })
    //console.log(code)
    //console.log(rjCustomerData)
    return customer_name
  }

  /* GET FG-STO DETAILS FROM SAP */
  const getStoDeliveryData = (e) => {
    // setFetch(false)
    e.preventDefault()
    // let panDetail =
    //console.log(stoValues.sto_delivery_number)

    NlmtStoDeliveryDataService.getFgstoDeliveryData(stoValues.sto_delivery_number).then((res) => {
      let sap_response = res.data[0]
      let sap_vehicle_no = sap_response.SIGNI
      let sap_po_number = sap_response.EBELN
      let sap_delivery_number = sap_response.VBELN
      let sap_from_location = sap_response.RESWK
      let sap_to_location = sap_response.WERKS
      let sap_delivery_quantity = sap_response.LFIMG
      let sap_delivery_freight = sap_response.KBETR
      let sap_delivery_division = sap_response.DIVISION
      //console.log(res)

      /* ========================================================== */
      // let vehicleTripNumber = 'TN69RT4545'
      // // let vehicleTripNumber = tripInfo.vehicle_number
      // //console.log(sap_vehicle_no)
      // if (!sap_vehicle_no) {
      //   emptySTOData()
      //   toast.warning('No STO Delivery Details Detected! ')
      //   return false
      // }

      // if (sap_vehicle_no !== vehicleTripNumber) {
      //   emptySTOData()
      //   toast.warning('Vehicle Number Mismatched')
      //   return false
      // }
      /* ========================================================== */

      if (
        // sap_vehicle_no &&
        sap_po_number &&
        sap_from_location &&
        sap_to_location &&
        sap_delivery_quantity &&
        sap_delivery_freight &&
        sap_delivery_division
      ) {
        assignSTOData(sap_response)
      } else {
        emptySTOData()
        toast.warning('No FG-STO Delivery Details Detected! ')
        return false
      }

      //console.log(sap_vehicle_no + '/' + sap_po_number + '/' + sap_delivery_number)

      //console.log(res)
    })
  }

  useEffect(() => {
    if (tripInfo && tripInfo[0]?.tripsheet_info && tripInfo[0]?.trip_sheet_info.nlmt_tripsheet_no) {
      //  //console.log(tripInfo.trip_sheet_info.purpose, 'tripInfo.trip_sheet_info.purpose')
      let trip_sap_flag = tripInfo.tripsheet_info.sap_flag
      let trip_pp_flag = tripInfo.tripsheet_info.pp_flag
      //console.log(`${trip_sap_flag}||${trip_pp_flag}`, 'trip_sap_flag||trip_pp_flag')

      // if(tripInfo.trip_sheet_info.purpose == '3'){
      NlmtStoDeliveryDataService.getRmstoDeliveryData(
        tripInfo.tripsheet_info.nlmt_tripsheet_no
      ).then((res) => {
        let sap_response = res.data
        //console.log(sap_response, 'getRmstoDeliveryData')
        if (sap_response.length > 0) {
          assignRMSTOData(sap_response)
        } else {
          emptyRMSTOData()
          toast.warning('No RMSTO Delivery Details Detected! ')
        }
      })
      // }

      // if(trip_sap_flag == '1'){
      NlmtStoDeliveryDataService.getAllFgstoDeliveryData(
        tripInfo.tripsheet_info.nlmt_tripsheet_no
      ).then((res) => {
        let sap_response = res.data
        //console.log(sap_response, 'getAllFgstoDeliveryData')
        if (sap_response.length > 0) {
          toast.success('FGSTO Delivery Details Detected!')
          assignFGSTOData(sap_response)
        } else {
          emptySTOData()
          toast.warning('No FGSTO Delivery Details Detected! ')
        }
      })
      // }
      NlmtStoDeliveryDataService.getFciDeliveryData(tripInfo.tripsheet_info.nlmt_tripsheet_no).then(
        (res) => {
          let sap_response = res.data
          //console.log(sap_response, 'getFciDeliveryData')
          if (sap_response.length > 0) {
            // toast.success('FCI Delivery Details Detected!')
            assignFCIData(sap_response)
          } else {
            emptyFCIData()
            toast.warning('No FCI Delivery Details Detected! ')
          }
        }
      )
    }
  }, [tripInfo])

  /* GET RM-STO DETAILS FROM SAP */
  const getRmstoDeliveryData = (e) => {
    // setFetch(false)
    e.preventDefault()
    // let panDetail =
    //console.log(stoValuesRMSTO.sto_delivery_number_rmsto)
    let delivery_no = stoValuesRMSTO.sto_delivery_number_rmsto
    if (!delivery_no) {
      emptyRMSTOData()
      toast.warning('STO Delivery Number Required..! ')
      return false
    }
    NlmtStoDeliveryDataService.getRmstoDeliveryData(delivery_no).then((res) => {
      let sap_response = res.data[0]
      let sap_vehicle_no = sap_response.SIGNI
      let sap_po_number = sap_response.EBELN
      let sap_delivery_number = sap_response.VBELN
      let sap_from_location = sap_response.RESWK
      let sap_to_location = sap_response.WERKS
      let sap_delivery_quantity = sap_response.LFIMG
      let sap_delivery_freight = sap_response.KBETR
      let sap_delivery_division = sap_response.DIVISION
      //console.log(res)

      let vehicleTripNumber = 'TN69RT4546'
      // let vehicleTripNumber = tripInfo.vehicle_number
      //console.log(sap_vehicle_no)
      if (!sap_vehicle_no) {
        emptyRMSTOData()
        toast.warning('No STO Delivery Details Detected! ')
        return false
      }

      /* This Should be included befor go to production */
      // if (sap_vehicle_no !== vehicleTripNumber) {
      //   emptyRMSTOData()
      //   toast.warning('Vehicle Number Mismatched')
      //   return false
      // }

      if (
        sap_vehicle_no &&
        sap_po_number &&
        sap_from_location &&
        sap_to_location &&
        sap_delivery_quantity &&
        sap_delivery_freight &&
        sap_delivery_division
      ) {
        assignRMSTOData(sap_response)
      } else if (sap_delivery_freight == '0') {
        emptyRMSTOData()
        toast.warning('This delivery have Empty Freight. Cannot be accepted! ')
        return false
      } else {
        emptyRMSTOData()
        toast.warning('No RMSTO Delivery Details Detected! ')
        return false
      }

      //console.log(sap_vehicle_no + '/' + sap_po_number + '/' + sap_delivery_number)

      //console.log(res)
      //console.log(stoTableDataRMSTO, 'stoTableDataRMSTO')
      //console.log(stoValuesRMSTO, 'stoValuesRMSTO')
    })
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

  /* tabRJSOISuccess Setup */
  useEffect(() => {
    if (rjsoInfo) {
      let rjso_data_valid = true
      const rjso_data_array = []
      rjsoInfo.map((parent, parent_id) => {
        //console.log(parent)
        if (
          (parent.actual_delivery_date_time || parent.actual_delivery_date_time_validated) &&
          (parent.unloading_charges || parent.unloading_charges_validated) &&
          (parent.rj_pod_copy || parent.rj_pod_copy_validated)
        ) {
          rjso_data_array.push({
            parent: parent_id,
            validated: true,
          })
        } else {
          rjso_data_array.push({
            parent: parent_id,
            validated: true,
            // validated: false,
          })
        }
      })

      //console.log(rjso_data_array, 'rjso_data_array')

      rjso_data_array.map((value, index) => {
        if (value.validated == false) {
          rjso_data_valid = false
        }
      })
      // //console.log(rjso_data_array)

      if (rjso_data_valid) {
        //console.log('rjso_data_valid-111')
        setTabRJSOSuccess(true)
      } else {
        //console.log('rjso_data_valid-112')
        setTabRJSOSuccess(false)
      }
    }
  }, [rjsoInfo])

  // useEffect(() => {
  //   if (tabGISuccess && tabFJSuccess && tabRJSOSuccess && tabFGSTOSuccess && tabRMSTOSuccess) {
  //     setTabFJ_RJ_FG_RM_STO_Success(true)
  //   } else {
  //     setTabFJ_RJ_FG_RM_STO_Success(false)
  //   }
  // }, [])

  /* tabFGSTOISuccess Setup */
  useEffect(() => {
    //console.log(stoTableData, 'stoTableDataTest1')
    if (stoTableData && tripInfo && tripInfo.tripsheet_info) {
      //console.log(stoTableData, 'stoTableDataTest2')
      {
        /* Condition 1 : FGSTO data must have atleast 1 child */
      }
      let condition1 = stoTableData.length > 0 ? true : false

      //console.log(condition1, 'condition1')

      {
        /* Condition 2 : FGSTO Trip Addon Availability Not Chosen and  FGSTO data have 0 elements and FGSTO is not a FJ Journey  */
      }
      let condition2 = stoTableData.length === 0 && fgsto_tripAddonAvailability == 2 ? true : false

      //console.log(condition2, 'condition2')

      {
        /* Condition 3 : SAP : FGSTO data must have atleast 1 child */
      }
      let condition3 = stoTableDataFGSTO.length > 0 ? true : false

      //console.log(stoTableData.length, '1')
      //console.log(fgsto_tripAddonAvailability, '2')

      if (condition1 || condition2 || condition3) {
        //console.log('setTrue1')
        setTabFGSTOSuccess(true)
      } else {
        //console.log('setFalse')
        setTabFGSTOSuccess(false)
      }
    }
  }, [stoTableData, tripInfo, stoTableDataFGSTO])
  // }, [])

  /* tabRMSTOISuccess Setup */
  useEffect(() => {
    //console.log(stoTableDataRMSTO, 'stoTableDataRMSTO1')
    if (stoTableDataRMSTO && tripInfo && tripInfo.tripsheet_info) {
      //console.log(stoTableDataRMSTO, 'stoTableDataRMSTO2')
      {
        /* Condition 3 : RMSTO data must have atleast 1 child */
      }
      let condition3 = stoTableDataRMSTO.length > 0 ? true : false
      //console.log(condition3, 'condition3')

      {
        /* Condition 4 : RMSTO Trip Addon Availability Not Chosen and  RMSTO data have 0 elements and RMSTO is not a FJ Journey*/
      }
      let condition4 =
        stoTableDataRMSTO.length === 0 && rmsto_tripAddonAvailability === 2 ? true : false

      //console.log(condition4, 'condition4')

      //console.log(stoTableDataRMSTO.length, '1')
      //console.log(rmsto_tripAddonAvailability, '2')

      if (condition3 || condition4) {
        setTabRMSTOSuccess(true)
      } else {
        setTabRMSTOSuccess(false)
      }
    }
  }, [stoTableDataRMSTO, tripInfo])
  // }, [])

  /* TabFCISuccess Setup */
  useEffect(() => {
    if (stoTableDataFCI && tripInfo && tripInfo.tripsheet_info) {
      //console.log(stoTableDataFCI, 'stoTableDataFCI')
      {
        /* Condition 3 : FCI data must have atleast 1 child */
      }
      let condition3 = stoTableDataFCI.length > 0 ? true : false
      //console.log(condition3, 'condition3')
      //console.log(stoTableDataFCI.length, '1')

      let condition4 = stoTableDataFCI.length == 0 ? true : false

      if (condition3 || condition4) {
        setTabFCISuccess(true)
      } else {
        setTabFCISuccess(false)
      }
    }
  }, [stoTableDataFCI, tripInfo])

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

  /* tabDISuccess Setup */
  useEffect(() => {
    let fgsalesdi_data = shipmentInfo
    let rjsodi_data = rjsoInfo
    let fgstodi_data = stoTableData
    let rmstodi_data = stoTableDataRMSTO
    let othersdi_data = stoOthersTableData
    let fci_di_data = stoTableDataFCI

    let addon_available_array = []

    console.log(
      shipmentInfo.length,
      '-',
      rjsoInfo.length,
      '-',
      stoTableData.length,
      '-',
      stoTableDataRMSTO.length,
      '-',
      stoOthersTableData.length,
      '-',
      stoTableDataFCI.length
    )

    let fgsalesdi_data_validity = []
    let rjsodi_data_validity = []
    let fgstodi_data_validity = []
    let sap_fgstodi_data_validity = []
    let rmstodi_data_validity = []
    let othersdi_data_validity = []
    let fci_di_data_validity = []

    let fgsalesdi_data_availability = shipmentInfo.length === 0 ? false : true
    let rjsodi_data_availability = rjsoInfo.length === 0 ? false : true
    let fgstodi_data_availability = stoTableData.length === 0 ? false : true
    let sap_fgstodi_data_availability = stoTableDataFGSTO.length === 0 ? false : true
    let rmstodi_data_availability = stoTableDataRMSTO.length === 0 ? false : true
    let othersdi_data_availability = stoOthersTableData.length === 0 ? false : true
    let fci_di_data_availability = stoTableDataFCI.length === 0 ? false : true

    if (fgsalesdi_data_availability) {
      //console.log(shipmentInfo)
      shipmentInfo.map((parent_val1, index1) => {
        if (
          // parent_val1.diesel_cons_qty_ltr_input &&
          parent_val1.opening_km_input &&
          parent_val1.closing_km_input
        ) {
          fgsalesdi_data_validity[index1] = true
        } else {
          // fgsalesdi_data_validity[index1] = false
          fgsalesdi_data_validity[index1] = true
        }
      })
    }

    if (rjsodi_data_availability) {
      rjsoInfo.map((parent_val2, index2) => {
        if (
          // parent_val2.diesel_cons_qty_ltr_input &&
          (parent_val2.opening_km_input || parent_val2.opening_km) &&
          (parent_val2.closing_km_input || parent_val2.closing_km)
        ) {
          rjsodi_data_validity[index2] = true
        } else {
          rjsodi_data_validity[index2] = true
          // rjsodi_data_validity[index2] = false
        }
      })
    }

    if (fgstodi_data_availability) {
      //console.log(stoTableData)
      stoTableData.map((parent_val3, index3) => {
        if (
          // parent_val3.diesel_cons_qty_ltr_input &&
          (parent_val3.opening_km_input || parent_val3.opening_km) &&
          (parent_val3.closing_km_input || parent_val3.closing_km)
        ) {
          fgstodi_data_validity[index3] = true
        } else {
          // fgstodi_data_validity[index3] = false
          fgstodi_data_validity[index3] = true
        }
      })
    }

    if (othersdi_data_availability) {
      //console.log(stoOthersTableData)
      stoOthersTableData.map((parent_val7, index7) => {
        if (
          // parent_val3.diesel_cons_qty_ltr_input &&
          (parent_val7.opening_km_input || parent_val7.opening_km) &&
          (parent_val7.closing_km_input || parent_val7.closing_km)
        ) {
          othersdi_data_validity[index7] = true
        } else {
          // fgstodi_data_validity[index3] = false
          othersdi_data_validity[index7] = true
        }
      })
    }

    if (sap_fgstodi_data_availability) {
      //console.log(stoTableDataFGSTO)
      stoTableDataFGSTO.map((parent_val5, index5) => {
        if (
          // parent_val3.diesel_cons_qty_ltr_input &&
          (parent_val5.opening_km_input || parent_val5.opening_km) &&
          (parent_val5.closing_km_input || parent_val5.closing_km)
        ) {
          sap_fgstodi_data_validity[index5] = true
        } else {
          // fgstodi_data_validity[index3] = false
          sap_fgstodi_data_validity[index5] = true
        }
      })
    }

    if (rmstodi_data_availability) {
      //console.log(stoTableDataRMSTO)
      stoTableDataRMSTO.map((parent_val4, index4) => {
        if (
          // parent_val4.diesel_cons_qty_ltr_input &&
          (parent_val4.opening_km_input || parent_val4.opening_km) &&
          (parent_val4.closing_km_input || parent_val4.closing_km)
        ) {
          rmstodi_data_validity[index4] = true
        } else {
          // rmstodi_data_validity[index4] = false
          rmstodi_data_validity[index4] = true
        }
      })
    }

    if (fci_di_data_availability) {
      //console.log(stoTableDataRMSTO)
      stoTableDataFCI.map((parent_val4, index4) => {
        if (
          // parent_val4.diesel_cons_qty_ltr_input &&
          (parent_val4.opening_km_input || parent_val4.opening_km) &&
          (parent_val4.closing_km_input || parent_val4.closing_km)
        ) {
          fci_di_data_validity[index4] = true
        } else {
          fci_di_data_validity[index4] = true
        }
      })
    }

    fgsalesdi_data_availability
      ? addon_available_array.push({ fgsalesdi_data_availability: fgsalesdi_data_validity })
      : ''
    rjsodi_data_availability
      ? addon_available_array.push({ rjsodi_data_availability: rjsodi_data_validity })
      : ''
    fgstodi_data_availability
      ? addon_available_array.push({ fgstodi_data_availability: fgstodi_data_validity })
      : ''
    sap_fgstodi_data_availability
      ? addon_available_array.push({ sap_fgstodi_data_availability: sap_fgstodi_data_validity })
      : ''
    rmstodi_data_availability
      ? addon_available_array.push({ rmstodi_data_availability: rmstodi_data_validity })
      : ''
    othersdi_data_availability
      ? addon_available_array.push({ othersdi_data_availability: othersdi_data_validity })
      : ''
    fci_di_data_availability
      ? addon_available_array.push({ fci_di_data_availability: fci_di_data_validity })
      : ''

    //console.log(fgsalesdi_data_validity)
    //console.log(rjsodi_data_validity)
    //console.log(fgstodi_data_validity)
    //console.log(sap_fgstodi_data_validity)
    //console.log(rmstodi_data_validity)
    //console.log(othersdi_data_validity)
    //console.log(fci_di_data_availability)
    var di_success_valid = true
    //console.log(addon_available_array, 'addon_available_array')

    addon_available_array.map((dataA, indexA) => {
      if (dataA.fgsalesdi_data_availability && dataA.fgsalesdi_data_availability.length > 0) {
        dataA.fgsalesdi_data_availability.map((dataA1, indexA1) => {
          if (dataA1 === false) {
            di_success_valid = false
          }
        })
      }

      if (dataA.fci_di_data_availability && dataA.fci_di_data_availability.length > 0) {
        dataA.fci_di_data_availability.map((dataA1, indexA1) => {
          if (dataA1 === false) {
            di_success_valid = false
          }
        })
      }

      if (dataA.rjsodi_data_availability && dataA.rjsodi_data_availability.length > 0) {
        dataA.rjsodi_data_availability.map((dataB1, indexB1) => {
          if (dataB1 === false) {
            di_success_valid = false
          }
        })
      }

      if (dataA.sap_fgstodi_data_availability && dataA.sap_fgstodi_data_availability.length > 0) {
        dataA.sap_fgstodi_data_availability.map((dataC1, indexC1) => {
          if (dataC1 === false) {
            di_success_valid = false
          }
        })
      }

      if (dataA.fgstodi_data_availability && dataA.fgstodi_data_availability.length > 0) {
        dataA.fgstodi_data_availability.map((dataC1, indexC1) => {
          if (dataC1 === false) {
            di_success_valid = false
          }
        })
      }

      if (dataA.rmstodi_data_availability && dataA.rmstodi_data_availability.length > 0) {
        dataA.rmstodi_data_availability.map((dataD1, indexD1) => {
          if (dataD1 === false) {
            di_success_valid = false
          }
        })
      }

      if (dataA.othersdi_data_availability && dataA.othersdi_data_availability.length > 0) {
        dataA.othersdi_data_availability.map((dataE1, indexE1) => {
          if (dataE1 === false) {
            di_success_valid = false
          }
        })
      }

      //console.log(di_success_valid)

      if (di_success_valid) {
        setTabDISuccess(true)
      } else {
        setTabDISuccess(false)
      }
    })
  }, [
    shipmentInfo,
    rjsoInfo,
    stoTableData,
    stoTableDataFGSTO,
    stoTableDataRMSTO,
    tripInfo,
    stoOthersTableData,
    stoTableDataFCI,
  ])

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

  /* ====== Diesel Consumption Ltr (Aprox.) & Runnnig KM Calculation Part Start ===== */

  /* ================= FGSALES ========================================= */
  const changeVadTableItemForDCC = (event, child_property_name, parent_index, arpl = '') => {
    let getData4 = event.target.value

    if (child_property_name == 'diesel_cons_qty_ltr') {
      getData4 = event.target.value
        .replace(/[^0-9^\.]+/g, '')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^0+/, '')
    } else if (child_property_name == 'closing_km' || child_property_name == 'opening_km') {
      getData4 = event.target.value.replace(/\D/g, '')
    }

    const fgsales_parent_info = JSON.parse(JSON.stringify(shipmentInfo))

    if (child_property_name == 'diesel_cons_qty_ltr') {
      fgsales_parent_info[parent_index][`${child_property_name}_input`] = getData4
      fgsales_parent_info[parent_index][`diesel_amount_input`] = Math.round(getData4 * arpl)
    } else if (child_property_name == 'opening_km') {
      fgsales_parent_info[parent_index][`${child_property_name}_input`] = getData4
      fgsales_parent_info[parent_index][`running_km_input`] = fgsales_parent_info[parent_index][
        `closing_km_input`
      ]
        ? Number(fgsales_parent_info[parent_index][`closing_km_input`]) - Number(getData4)
        : ''
    } else if (child_property_name == 'closing_km') {
      fgsales_parent_info[parent_index][`${child_property_name}_input`] = getData4
      fgsales_parent_info[parent_index][`running_km_input`] = fgsales_parent_info[parent_index][
        `opening_km_input`
      ]
        ? Number(getData4) - Number(fgsales_parent_info[parent_index][`opening_km_input`])
        : ''
    } else {
      fgsales_parent_info[parent_index][`${child_property_name}_input`] = getData4
    }

    // //console.log(shipment_parent_info)

    setShipmentInfo(fgsales_parent_info)
  }

  //console.log(tabFGSTOSuccess, 'tabFGSTOSuccess')
  //console.log(shipmentInfo)

  const vadDataUpdateForDCC = (original, input) => {
    return input === undefined ? original : input
  }

  /* ================= RJSO ========================================= */
  const changeRjsoTableItemForDCC = (event, child_property_name, parent_index, arpl = '') => {
    let getData1 = event.target.value

    if (child_property_name == 'diesel_cons_qty_ltr') {
      getData1 = event.target.value
        .replace(/[^0-9^\.]+/g, '')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^0+/, '')
    } else if (child_property_name == 'closing_km' || child_property_name == 'opening_km') {
      getData1 = event.target.value.replace(/\D/g, '')
    }

    const rjso_parent_info = JSON.parse(JSON.stringify(rjsoInfo))

    if (child_property_name == 'diesel_cons_qty_ltr') {
      rjso_parent_info[parent_index][`${child_property_name}_input`] = getData1
      rjso_parent_info[parent_index][`diesel_amount_input`] = Math.round(getData1 * arpl)
    } else if (child_property_name == 'opening_km') {
      rjso_parent_info[parent_index][`${child_property_name}_input`] = getData1
      rjso_parent_info[parent_index][`running_km_input`] = rjso_parent_info[parent_index][
        `closing_km_input`
      ]
        ? Number(rjso_parent_info[parent_index][`closing_km_input`]) - Number(getData1)
        : ''
    } else if (child_property_name == 'closing_km') {
      rjso_parent_info[parent_index][`${child_property_name}_input`] = getData1
      rjso_parent_info[parent_index][`running_km_input`] = rjso_parent_info[parent_index][
        `opening_km_input`
      ]
        ? Number(getData1) - Number(rjso_parent_info[parent_index][`opening_km_input`])
        : ''
    } else {
      rjso_parent_info[parent_index][`${child_property_name}_input`] = getData1
    }

    // //console.log(shipment_parent_info)
    setRjsoInfo(rjso_parent_info)
  }

  //console.log(rjsoInfo)

  const rjsoDataUpdateForDCC = (original, input) => {
    return input === undefined ? original : input
  }

  /* ================= SAP : FGSTO ========================================= */
  const changeSapFgstoTableItemForDCC = (event, child_property_name, parent_index, arpl = '') => {
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

    const sap_fgsto_parent_info = JSON.parse(JSON.stringify(stoTableDataFGSTO))

    if (child_property_name == 'diesel_cons_qty_ltr') {
      sap_fgsto_parent_info[parent_index][`${child_property_name}_input`] = getData2
      sap_fgsto_parent_info[parent_index][`diesel_amount_input`] = Math.round(getData2 * arpl)
    } else if (child_property_name == 'opening_km') {
      sap_fgsto_parent_info[parent_index][`${child_property_name}_input`] = getData2
      sap_fgsto_parent_info[parent_index][`running_km_input`] = sap_fgsto_parent_info[parent_index][
        `closing_km_input`
      ]
        ? Number(sap_fgsto_parent_info[parent_index][`closing_km_input`]) - Number(getData2)
        : ''
    } else if (child_property_name == 'closing_km') {
      sap_fgsto_parent_info[parent_index][`${child_property_name}_input`] = getData2
      sap_fgsto_parent_info[parent_index][`running_km_input`] = sap_fgsto_parent_info[parent_index][
        `opening_km_input`
      ]
        ? Number(getData2) - Number(sap_fgsto_parent_info[parent_index][`opening_km_input`])
        : ''
    } else {
      sap_fgsto_parent_info[parent_index][`${child_property_name}_input`] = getData2
    }

    setStoTableDataFGSTO(sap_fgsto_parent_info)
  }

  //console.log(stoTableDataFGSTO)

  const sapFgstoDataUpdateForDCC = (original, input) => {
    return input === undefined ? original : input
  }

  /* ================= FGSTO ========================================= */
  const changeFgstoTableItemForDCC = (event, child_property_name, parent_index, arpl = '') => {
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

    const fgsto_parent_info = JSON.parse(JSON.stringify(stoTableData))

    if (child_property_name == 'diesel_cons_qty_ltr') {
      fgsto_parent_info[parent_index][`${child_property_name}_input`] = getData2
      fgsto_parent_info[parent_index][`diesel_amount_input`] = Math.round(getData2 * arpl)
    } else if (child_property_name == 'opening_km') {
      fgsto_parent_info[parent_index][`${child_property_name}_input`] = getData2
      fgsto_parent_info[parent_index][`running_km_input`] = fgsto_parent_info[parent_index][
        `closing_km_input`
      ]
        ? Number(fgsto_parent_info[parent_index][`closing_km_input`]) - Number(getData2)
        : ''
    } else if (child_property_name == 'closing_km') {
      fgsto_parent_info[parent_index][`${child_property_name}_input`] = getData2
      fgsto_parent_info[parent_index][`running_km_input`] = fgsto_parent_info[parent_index][
        `opening_km_input`
      ]
        ? Number(getData2) - Number(fgsto_parent_info[parent_index][`opening_km_input`])
        : ''
    } else {
      fgsto_parent_info[parent_index][`${child_property_name}_input`] = getData2
    }

    setStoTableData(fgsto_parent_info)
  }

  //console.log(stoTableData)

  const fgstoDataUpdateForDCC = (original, input) => {
    return input === undefined ? original : input
  }

  /* ================= RMSTO ========================================= */
  const changeRmstoTableItemForDCC = (event, child_property_name, parent_index, arpl = '') => {
    let getData3 = event.target.value

    if (child_property_name == 'diesel_cons_qty_ltr') {
      getData3 = event.target.value
        .replace(/[^0-9^\.]+/g, '')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^0+/, '')
    } else if (child_property_name == 'closing_km' || child_property_name == 'opening_km') {
      getData3 = event.target.value.replace(/\D/g, '')
    }

    const rmsto_parent_info = JSON.parse(JSON.stringify(stoTableDataRMSTO))

    if (child_property_name == 'diesel_cons_qty_ltr') {
      rmsto_parent_info[parent_index][`${child_property_name}_input`] = getData3
      rmsto_parent_info[parent_index][`diesel_amount_input`] = Math.round(getData3 * arpl)
    } else if (child_property_name == 'opening_km') {
      rmsto_parent_info[parent_index][`${child_property_name}_input`] = getData3
      rmsto_parent_info[parent_index][`running_km_input`] = rmsto_parent_info[parent_index][
        `closing_km_input`
      ]
        ? Number(rmsto_parent_info[parent_index][`closing_km_input`]) - Number(getData3)
        : ''
    } else if (child_property_name == 'closing_km') {
      rmsto_parent_info[parent_index][`${child_property_name}_input`] = getData3
      rmsto_parent_info[parent_index][`running_km_input`] = rmsto_parent_info[parent_index][
        `opening_km_input`
      ]
        ? Number(getData3) - Number(rmsto_parent_info[parent_index][`opening_km_input`])
        : ''
    } else {
      rmsto_parent_info[parent_index][`${child_property_name}_input`] = getData3
    }

    setStoTableDataRMSTO(rmsto_parent_info)
  }

  //console.log(stoTableDataRMSTO)

  const rmstoDataUpdateForDCC = (original, input) => {
    return input === undefined ? original : input
  }

  const RmstoInfoAvailable = (ddata) => {
    let condition = 0
    let val = 0
    ddata.map((data_val, index_val) => {
      //console.log(data_val, 'data_val-RmstoInfoAvailable')
      if (data_val.sto_delivery_number_rmsto != '') {
        val++
      }
    })
    //console.log(val, 'RmstoInfoAvailable-length')
    if (val > 0) {
      condition = 1
    }

    if (condition === 1) {
      return true
    } else {
      return false
    }
  }

  const FCIInfoAvailable = (ddata) => {
    let condition = 0
    let val = 0
    ddata.map((data_val, index_val) => {
      //console.log(data_val, 'data_val-FCIInfoAvailable')
      if (data_val.sto_delivery_number_rmsto != '') {
        val++
      }
    })
    //console.log(val, 'FCIInfoAvailable-length')
    if (val > 0) {
      condition = 1
    }

    if (condition === 1) {
      return true
    } else {
      return false
    }
  }

  const RakeInfoAvailable = (ddata) => {
    let condition = 0
    let val = 0
    ddata.map((data_val, index_val) => {
      //console.log(data_val, 'data_val-RakeInfoAvailable')
      if (data_val.sto_delivery_number_rmsto == '') {
        val++
      }
    })
    //console.log(val, 'RakeInfoAvailable-length')
    if (val > 0) {
      condition = 1
    }

    if (condition === 1) {
      return true
    } else {
      return false
    }
  }

  /* ====== Diesel Consumption Ltr (Aprox.) & Runnnig KM Calculation Part End ===== */

  const fetchShipmentChildData = (shipmentNumber) => {
    NlmtVehicleAssignmentService.getSingleShipmentChildInfo(shipmentNumber).then((res) => {
      //console.log(res.data.data,'shipment_child_info')
      setShipmentChildInfo(res.data.data)
    })
  }

  const getDieselVendorNameById = (vendor_id) => {
    //console.log(dvData, 'dieselVendorFinder-dvData')
    //console.log(vendor_id, 'dieselVendorFinder-vendor_id')
    let vendorName = '-'
    for (let i = 0; i < dvData.length; i++) {
      if (dvData[i].diesel_vendor_id == vendor_id) {
        vendorName = dvData[i].diesel_vendor_name
      }
    }
    //console.log(vendorName, 'dieselVendorFinder-vendorName')
    return vendorName

    // let driverName = code == '1' ? 'RNS Fuel Station' : 'RS Petroleum'
    // return driverName
  }

  useEffect(() => {
    if (tripInfo.diesel_intent_collection_info) {
      totalDieselInfoCalculation()
    } else {
      setRvValues(TripsheetClosureConstants.InitialRVValues)
    }
  }, [dieselCollectionInfo])

  const updatedFetchedData = (getData) => {
    getData.map((parent, parent_id) => {
      return parent.shipment_child_info.map((child, child_id) => {
        child = { ...child, ...TripsheetClosureConstants.vadGetInputs }
      })
    })
  }

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

  useEffect(() => {
    if (tripInfo.diesel_intent_info && tripInfo.diesel_intent_info.vendor_code) {
      DieselVendorMasterService.getDieselVendorsByCode(
        tripInfo.diesel_intent_info.vendor_code
      ).then((res) => {
        //console.log(res.data.data,'diesel_intent_info')
        res.data.data != null
          ? setDieselVendorName(res.data.data.diesel_vendor_name)
          : setDieselVendorName('')
      })
    } else {
      setDieselVendorName('')
    }
  }, [tripInfo.diesel_intent_info])

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
    if (tripInfo && tripInfo.tripsheet_info) {
      /* section for getting VR Lists from database */
      VehicleRequestMasterService.getClosureVehicleRequests().then((res) => {
        let vrList = res.data.data
        //console.log(vrList, 'getVehicleRequests')
        let filterData = vrList.filter(
          (data) =>
            data.vr_tr_no == null || data.vr_tr_no == tripInfo.tripsheet_info.nlmt_tripsheet_no
        )
        //console.log(filterData, 'getVehicleRequests-filterData')
        setVrData(filterData)
      })
    }
    //   },[tripInfo, tripInfo.trip_sheet_info])
  }, [tripInfo])

  useEffect(() => {
    //section for getting vehicle capacity from database
    //

    // VehicleBodyTypeService.getVehicleBody().then((res) => {
    //   setVehicleBody(res.data.data)
    // })

    //section for getting vehicle variety from database
    // VehicleVarietyService.getVehicleVariety().then((res) => {
    //   setVehicleVariety(res.data.data)
    // })

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
        tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id == 22) &&
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

  /* Fetch Others Process Details From SAP */
  const getOthersSapData = (e) => {
    // setFetch(false)
    e.preventDefault()
    // let panDetail =
    //console.log(stoOthersValues.others_sto_doc_number)

    NlmtStoDeliveryDataService.getOthersDeliveryData(
      stoOthersValues.others_sto_doc_number,
      values.ot_process_type
    )
      .then((res) => {
        setFetch(true)
        let sap_response = res.data[0]
        let sap_doc_date = sap_response.DOC_DATE
        let sap_from_plant_code = sap_response.FROM_PLANT
        let sap_from_plant_name = sap_response.FROM_PLANT_NAME
        let sap_to_plant_code = sap_response.TO_PLANT
        let sap_to_plant_name = sap_response.TO_PLANT_NAME
        let sap_vendor_code = sap_response.VENDOR_CODE
        let sap_vendor_name = sap_response.VENDOR_NAME
        let sap_doc_number = sap_response.DOC_NO
        let sap_po_number = sap_response.PO_NO
        let sap_process_type = sap_response.PROCESS_TYPE
        //console.log(res)
        //console.log(sap_response, 'sap_response')

        let process_type_exception_array = [
          'CREDIT MEMO NO',
          'Bill of Supply No',
          'Delivery Challan No',
          'Gate Pass NO',
        ]

        if (
          !(sap_doc_date == '00-00-0000' || sap_doc_date == '0000-00-00') &&
          (sap_from_plant_name || sap_to_plant_name) &&
          (sap_from_plant_code || sap_to_plant_code)
        ) {
          setCurrentSapOthersDeliveryData(sap_response)
          assignOthersSTOData(sap_response)
        } else {
          setCurrentSapOthersDeliveryData({})
          emptyOthersSTOData()
          toast.warning('No Others Process Details Detected! ')
          return false
        }
      })
      .catch((error) => {
        setFetch(true)
        toast.warning(error)
      })
  }

  const assignOthersSTOData = (sap) => {
    //console.log(sap, 'assignOthersSTOData')
    toast.success('Others Process Details Detected!')
    let updatedinputs = {}

    let others_sto_process_type = sap.PROCESS_TYPE
    let others_sto_doc_number = sap.DOC_NO
    let others_sto_doc_date = sap.DOC_DATE
    let others_sto_from_plant_code = sap.FROM_PLANT
    let others_sto_from_plant_name = sap.FROM_PLANT_NAME
    let others_sto_to_plant_code = sap.TO_PLANT
    let others_sto_to_plant_name = sap.TO_PLANT_NAME
    let others_sto_vendor_code = sap.VENDOR_CODE
    let others_sto_vendor_name = sap.VENDOR_NAME
    let others_sto_po_number = sap.PO_NO
    let others_sto_incoterm = sap.INCO1
    let others_sto_net_weight = sap.NET_WT
    let others_sto_customer_code = sap.CUSTOMER
    let others_sto_assignment = sap.ASSIGN
    let others_sto_va_no = sap.VA_NO
    let others_sto_truck_no = sap.TRUCK_NO

    updatedinputs = {
      ...stoOthersValues,
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
      others_sto_incoterm,
      others_sto_net_weight,
      others_sto_customer_code,
      others_sto_assignment,
      others_sto_va_no,
      others_sto_truck_no,
    }

    //console.log(updatedinputs)
    setStoOthersValues(updatedinputs)
    addOthersEnable(updatedinputs)
  }

  const vrNotMappingSapDoc = () => {
    let ercode = 0
    if (rjRequestsInfo.length > 0) {
      ercode = 1
    }
    let vr_id_array = []
    let doc_vr_id_array = []
    let filter_data = vrData.filter(
      (data) => data.vr_tr_no == tripInfo.tripsheet_info.nlmt_tripsheet_no
    )

    filter_data.map((vb, kb) => {
      if (JavascriptInArrayComponent(vb.vr_id, vr_id_array)) {
        //
      } else {
        vr_id_array.push(vb.vr_id)
      }
    })

    stoOthersTableData.map((vc, kc) => {
      if (JavascriptInArrayComponent(vc.others_sto_vr_id, doc_vr_id_array)) {
        //
      } else {
        doc_vr_id_array.push(vc.others_sto_vr_id)
      }
    })

    let acceptance = 0
    let having = []
    vr_id_array.map((vd, kd) => {
      doc_vr_id_array.map((ve, ke) => {
        if (vd == ve) {
          acceptance = 1
        }
      })
      if (acceptance == 1) {
        having.push(vd) //vr_id_array element pushed, if sap doc having
      }
    })

    if (vr_id_array.length != having.length) {
      ercode = 2
    }

    //console.log(stoOthersTableData, 'vrNotMappingSapDoc - stoOthersTableData')
    //console.log(vrData, 'vrNotMappingSapDoc - vrData')
    //console.log(vr_id_array, 'vrNotMappingSapDoc - vr_id_array')
    //console.log(doc_vr_id_array, 'vrNotMappingSapDoc - doc_vr_id_array')
    //console.log(rjRequestsInfo, 'vrNotMappingSapDoc - rjRequestsInfo')
    //console.log(ercode, 'vrNotMappingSapDoc - ercode')
    //console.log(having, 'vrNotMappingSapDoc - having')
    return ercode
  }

  /* Remove Others DETAILS */
  const emptyOthersSTOData = () => {
    let updatedinputs = {}
    setCurrentSapOthersDeliveryData({})

    let others_sto_process_type = ''
    // let others_sto_doc_number = ''
    let others_sto_doc_date = ''
    let others_sto_from_plant_code = ''
    let others_sto_from_plant_name = ''
    let others_sto_to_plant_code = ''
    let others_sto_to_plant_name = ''
    let others_sto_vendor_code = ''
    let others_sto_vendor_name = ''
    let others_sto_po_number = ''
    let others_sto_incoterm = ''
    let others_sto_net_weight = ''
    let others_sto_customer_code = ''
    let others_sto_assignment = ''
    let others_sto_va_no = ''
    let others_sto_truck_no = ''

    updatedinputs = {
      ...stoOthersValues,
      others_sto_process_type,
      // others_sto_doc_number,
      others_sto_doc_date,
      others_sto_from_plant_code,
      others_sto_from_plant_name,
      others_sto_to_plant_code,
      others_sto_to_plant_name,
      others_sto_vendor_code,
      others_sto_vendor_name,
      others_sto_po_number,
      others_sto_incoterm,
      others_sto_net_weight,
      others_sto_customer_code,
      others_sto_assignment,
      others_sto_va_no,
      others_sto_truck_no,
    }

    //console.log(updatedinputs)
    setStoOthersValues(updatedinputs)
    addOthersEnable(updatedinputs)
  }

  useEffect(() => {
    if (values.ot_process_type == '') {
      emptyOthersSTOData()
    }
  }, [values.ot_process_type])

  const onOthersStoSubmitCancelBtn = () => {
    setStoDeliveryEdit(false)
    setStoOthersDeliveryInvalid(true)
    setStoOthersValues(TripsheetClosureConstants.stoOthersInitialState)
  }

  useEffect(() => {
    if (tripInfo && tripInfo.tripsheet_info) {
      //console.log(tripInfo.trip_sheet_info.vehicle_requests, 'vehicle_requests')

      let veh_req = tripInfo.tripsheet_info.vehicle_requests // 7,8,9

      if (veh_req != null) {
        const formData = new FormData()
        formData.append('vr_string', veh_req)

        NlmtTripInOwnVehicle.fetchVRList(formData).then((res) => {
          setSmallFetch(true)
          //console.log(res, 'fetchVRList')
          let vrlistData = res.data.data
          setVehicleRequestsData(vrlistData)
        })
      } else {
        setSmallFetch(true)
      }
    }
  }, [tripInfo.tripsheet_info])

  const TripsheetClosureSubmit = (process) => {
    if (is_admin) {
      console.log('-------------------tripInfo---------------------------')
      console.log(tripInfo)
      console.log('-------------------shipmentInfo---------------------------')
      console.log(shipmentInfo)
      console.log('-------------------RJSOInfo---------------------------')
      console.log(rjsoInfo)
      console.log('-------------------stoTableData---------------------------')
      console.log(stoTableData)
      console.log('-------------------stoTableDataFGSTO---------------------------')
      console.log(stoTableDataFGSTO)
      console.log('-------------------stoTableDataRMSTO---------------------------')
      console.log(stoTableDataRMSTO)
      console.log('-------------------stoTableDataFCI---------------------------')
      console.log(stoTableDataFCI)
      console.log('-------------------stoOthersTableData---------------------------')
      console.log(stoOthersTableData)
      console.log('-------------------vehicleRequestsData---------------------------')
      console.log(vehicleRequestsData)
      console.log('-------------------CalculationValues---------------------------')
      console.log(calculationValues)
      console.log('-------------------rvTotalValuesBP---------------------------')
      console.log(rvTotalValuesBP)
      console.log('-------------------FormValues---------------------------')
      console.log(values)
    }

    let sto1 = []
    let sto2 = []

    stoTableData.map((val1, key1) => {
      sto1.push(parseInt(val1.sto_delivery_number))
    })
    stoTableDataFGSTO.map((val2, key2) => {
      sto2.push(parseInt(val2.sto_delivery_number_fgsto))
    })

    const intersection_elements_array = sto1.filter((element) => sto2.includes(element))

    let updated_fgsto_data_array = []
    stoTableDataFGSTO.map((vv, kk) => {
      updated_fgsto_data_array.push({
        sto_delivery_date_time: vv.sto_delivery_date_time_fgsto,
        sto_to_location: vv.sto_to_location_fgsto,
        sto_po_number: vv.sto_po_number_fgsto,
        sto_from_location: vv.sto_from_location_fgsto,
        sto_freight_amount: vv.sto_freight_amount_fgsto,
        sto_delivery_quantity: vv.sto_delivery_quantity_fgsto,
        sto_delivery_number: vv.sto_delivery_number_fgsto,
        sto_delivery_division: vv.sto_delivery_division_fgsto,
      })
    })
    console.log(updated_fgsto_data_array, 'updated_fgsto_data_array')
    const all_sto_merged_array = stoTableData.concat(updated_fgsto_data_array)

    if (is_admin) {
      console.log(sto1, 'sto1')
      console.log(sto2, 'sto2')
      console.log(updated_fgsto_data_array, 'updated_fgsto_data_array')
      console.log(all_sto_merged_array, 'all_sto_merged_array')
      console.log(intersection_elements_array, 'intersection_elements_array')
    }

    if (intersection_elements_array.length != 0) {
      setFetch(true)
      toast.warning(`Same STO-Delivery Information can't allowed to save twice..`)
      return false
    }

    if (!(tripInfo.advance_info || tripInfo.vehicle_info.vehicle_type_id != '3')) {
      if (values.TdsHaving == '') {
        toast.warning(`TDS Tax Type Should be required.`)
        return false
      }
      if (values.GSTtax == '') {
        toast.warning(`GST Tax Type Should be required.`)
        return false
      }
      if (values.HSNtax == '') {
        toast.warning(`HSN Tax Type Should be required.`)
        return false
      }
    }

    if (tripInfo.vehicle_info.vehicle_type_id != '3') {
      if (vrNotMappingSapDoc() == 1) {
        setFetch(true)
        toast.warning(
          `Return Journey Approval should be completed before Expense Closure Process..`
        )
        return false
      } else if (vrNotMappingSapDoc() == 2) {
        setFetch(true)
        toast.warning(`Vehicle Requests of The Tripsheet should be mapped with Sap Documents.. `)
        return false
      }
    }
    console.log(
      tripInfo?.trip_settlement_info?.cost_center,
      'cost_centercost_centercost_centercost_center'
    )
    console.log(costCenterData, 'costCenterData')
    const sap_data = {
      TRIPSHEET_NO: tripInfo?.tripsheet_info?.nlmt_tripsheet_no,
      VEHICLE_NO: tripInfo?.vehicle_info?.vehicle_number,
      DEDUCT_REMARKS: tripInfo?.trip_settlement_info?.ded_remarks,
      LIFNR: tripInfo?.vendor_info?.vendor_code,
      POST_DATE: values.ded_posting_date,
      COST_CENTER: getCostCenterName(tripInfo?.trip_settlement_info?.cost_center),
      DEDUCT_AMT: tripInfo?.trip_settlement_info?.diversion_return_charges,
      // TRIPSHEET_NO: tripInfo?.tripsheet_info?.nlmt_tripsheet_no,
      // VEHICLE_NO: 'PY01R0101',
      // DEDUCT_REMARKS: 'hiii',
      // LIFNR: '216500',
      // POST_DATE: '2026-03-28',
      //COST_CENTER: 'MD-SALES',
      // DEDUCT_AMT: '10000',
    }

    NlmtTripSheetClosureService.hireDeductionPayment(sap_data).then((res) => {
      let sap_deduction_doc = res.data.DEDUCT_DOCUMENT_NO
      let sap_deduction_status = res.data.STATUS
      let sap_deduction_message = res.data.MESSAGE

      console.log(sap_deduction_doc + '/' + sap_deduction_status + '/' + sap_deduction_message)

      if (
        sap_deduction_status == '1' &&
        res.status == 200 &&
        sap_deduction_message &&
        sap_deduction_doc
      ) {
        const formData = new FormData()
        if (process == 'Approve') {
          formData.append('_method', 'PUT')
          formData.append('deduction_doc', sap_deduction_doc)
          formData.append('ded_posting_date', values.ded_posting_date)
          formData.append('vehicle_id', tripInfo.vehicle_id)
          formData.append('parking_id', tripInfo.nlmt_trip_in_id)
          formData.append('approval_status', 3)
          formData.append(
            'approval_remarks',
            values.approval_remarks ? values.approval_remarks : 'Approved'
          )
          let tripSettlementID = tripsettlementData.id
          setFetch(true)

          NlmtTripSheetClosureService.updateTripsheetExpenseApproval(tripSettlementID, formData)
            .then((res) => {
              console.log(res)
              if (res.status == 200) {
                setFetch(true)
                toast.success('Additional Expense Capture Process Updated Successfully!')
                navigation('/NlmtTSExpenseClosureHome')
              } else {
                setFetch(true)
                toast.warning('Additional Expense Capture Process Failed..')
                navigation('/NlmtTSExpenseClosureHome')
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
        } else if (process == 'reject') {
          // alert(`tripsettlement id = ${id}`)
          formData.append('_method', 'PUT')
          formData.append('vehicle_id', tripInfo.vehicle_id)
          formData.append('parking_id', tripInfo.nlmt_trip_in_id)
          formData.append('approval_status', 2)
          formData.append(
            'approval_remarks',
            values.approval_remarks ? values.approval_remarks : 'reject'
          )
          let tripSettlementID = tripsettlementData.id
          setFetch(true)
          NlmtTripSheetClosureService.updateTripsheetExpenseApproval(tripSettlementID, formData)
            .then((res) => {
              console.log(res)
              if (res.status == 200) {
                setFetch(true)
                toast.success('Additional Expense Capture Process Rejected Successfully!')
                navigation('/NlmtTSExpenseClosureHome')
              } else {
                setFetch(true)
                toast.warning('Additional Expense Capture Process Failed..')
                navigation('/NlmtTSExpenseClosureHome')
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
    })

    /* Values Assigning To Save Details into DB Part End*/
  }

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
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
                  {tripInfo?.diesel_intent_info &&
                    tripInfo &&
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
                          value={
                            tripInfo && tripInfo.tripsheet_info
                              ? [1, 2].includes(Number(tripInfo.tripsheet_info.advance_request))
                                ? 'YES'
                                : 'NO'
                              : ''
                          }
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
                      {tripInfo && tripInfo.vehicle_info.vehicle_type_id === 21 && (
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
                      {tripInfo && tripInfo.vehicle_info.vehicle_type_id === 22 && (
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
                      {tripInfo && tripInfo.vehicle_info.vehicle_type_id === 21 && (
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
                      {tripInfo && tripInfo.vehicle_info.vehicle_type_id === 22 && (
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
                          {tripInfo?.vendor_info?.vendor_code == null && (
                            <>
                              <CCol
                                xs={12}
                                md={6}
                                style={{ border: '1px solid black', background: 'aliceblue' }}
                              >
                                <CFormLabel>Note :</CFormLabel>

                                <span
                                  style={{ display: 'block', fontWeight: 'bold' }}
                                  className="big text-danger"
                                >
                                  Vendor Creation Process Not Completed..
                                </span>
                              </CCol>
                            </>
                          )}
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
                            <CCol xs={12} md={3}>
                              <CFormLabel
                                htmlFor="inputAddress"
                                style={{
                                  backgroundColor: '#4d3227',
                                  color: 'white',
                                }}
                              >
                                Shipment Number : {data.shipment_no}
                              </CFormLabel>
                            </CCol>
                          </CRow>
                          {data.shipment_child_info.map((val, val_index) => {
                            return (
                              <>
                                <CRow key={`HireshipmentChildData_${index}_${val_index}`}>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="sNum">Delivery Number</CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      id="sNum"
                                      value={val.delivery_no}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="sNum">Delivery Quantity in MTS</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      id="sNum"
                                      value={val.delivery_net_qty}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="sInvoice">Invoice Number</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      id="sInvoice"
                                      value={val.invoice_no}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="sNum">Invoice Quantity</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      id="sNum"
                                      value={`${val.invoice_net_quantity} - ${val.invoice_uom}`}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="sNum">
                                      Billed Shipment Quantity in MTS
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      id="sNum"
                                      value={`${data.billed_net_qty}`}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="cNum">Customer Name</CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      id="cNum"
                                      value={val.customer_info.CustomerName}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="cNum">Customer Code</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      id="cNum"
                                      value={val.customer_info.CustomerCode}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="cNum">Customer City</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      id="cNum"
                                      value={val.customer_info.CustomerCity}
                                      readOnly
                                    />
                                  </CCol>
                                  {/* <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="sDelivery">Delivered Date & Time</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type="datetime-local"
                                    onChange={(e) => {
                                      changeVadTableItem(e, 'delivered_date_time', index, val_index)
                                    }}
                                    value={vadDataUpdate(
                                      val.delivered_date_time,
                                      val.delivered_date_time_input
                                    )}
                                  />
                                  {val.delivered_date_time_validated === false && (
                                    <span className="small text-danger">
                                      Date & Time Should be Filled
                                    </span>
                                  )}
                                </CCol>

                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="fjPod">FJ POD Copy</CFormLabel>
                                  <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                    {//console.log(shipmentInfo,'shipmentInfo-FGSALES')}
                                    { !shipmentInfo[index].shipment_child_info[val_index].fj_pod_copy ? (
                                      <>
                                        <span
                                          className="float-start"
                                          onClick={() => {
                                            uploadClickFJ(index,val_index)
                                          }}
                                        >
                                          <CIcon
                                            style={{color:'red'}}
                                            icon={icon.cilFolderOpen}
                                            size="lg"
                                          />
                                          &nbsp;Upload
                                        </span>
                                        <span
                                          style={{marginRight:'10%'}}
                                          className="mr-10 float-end"
                                          onClick={() => {
                                            setFileImageKey(index+'|'+val_index)
                                            setCamEnableType("fjsales")
                                            setCamEnable(true)
                                          }}
                                        >
                                          <CIcon
                                              style={{color:'red'}}
                                              icon={icon.cilCamera}
                                              size="lg"
                                            />
                                          &nbsp;Camera
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="float-start">
                                          &nbsp;{shipmentInfo[index].shipment_child_info[val_index].fj_pod_copy_file_name}
                                        </span>
                                        <span className="float-end">
                                          <i
                                            className="fa fa-trash"
                                            aria-hidden="true"
                                            onClick={() => {
                                              clearValues(val_index,'fjsales',index)

                                            }}
                                          ></i>
                                        </span>
                                      </>
                                    )}
                                  </CButton>
                                  <CFormInput
                                    onBlur={onBlur}
                                    onChange={(e) => changeVadTableItem(e, 'fj_pod_copy', index, val_index)}
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    name={'fj_pod_copy'}
                                    size="sm"
                                    id={`fj_pod_copy_upload_yes_parent${index}_child${val_index}`}
                                    style={{display:'none'}}
                                  />
                                </CCol> */}

                                  <CCol xs={12} md={2}>
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
                                  {/* Hire Vehicle FJ POD Copy - OVFJPC */}
                                  {/* <CCol xs={12} md={2}>
                                        <CFormLabel htmlFor="fjPod">FJ POD Copy</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          type="file"
                                          value={vadHireDataUpdate(
                                            val.fj_pod_copy,
                                            val.fj_pod_copy_input
                                          )}
                                          onChange={(e) => {
                                            changeVadHireTableItem(e, 'fj_pod_copy', index, val_index)
                                          }}
                                        />
                                        {val.fj_pod_copy_validated === false && (
                                          <span className="small text-danger">
                                            FJ POD Copy Should be Filled
                                          </span>
                                        )}
                                      </CCol> */}
                                  <CCol md={2}>
                                    <CFormLabel htmlFor="DefectType">Defect Type</CFormLabel>

                                    <CFormSelect
                                      size="sm"
                                      onChange={(e) => {
                                        changeVadTableItem(e, 'defect_type', index, val_index)
                                      }}
                                      value={vadDataUpdate(val.defect_type, val.defect_type_input)}
                                      readOnly
                                    >
                                      <option value="">Select...</option>
                                      <option value="1">Shortage</option>
                                      <option value="2">Rain Damage</option>
                                      <option value="3">Sales Diversion</option>
                                      <option value="4">Sales Return</option>
                                      <option value="4">Halting</option>
                                    </CFormSelect>
                                  </CCol>
                                </CRow>
                              </>
                            )
                          })}
                        </>
                      )
                    })}
                  </CTabPane>
                  {/* Hire Vehicle FG-SALES Part End */}
                  {/* Hire Vehicle SAP : FG-STO Info Tab START================================= */}
                  <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 9}>
                    <div className="App">
                      <div>
                        {stoTableDataFGSTO.map((data_val, index_val) => {
                          //console.log(data_val, 'data_val-stoTableDataFGSTO.map')
                          return (
                            <>
                              <CRow className="mt-2" key={`fgsto_data_${index_val}`}>
                                <CCol md={2}>
                                  <CFormLabel>STO Delivery Number</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data_val.sto_delivery_number_fgsto}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>STO PO Number</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data_val.sto_po_number_fgsto}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>Division</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data_val.sto_delivery_division_fgsto}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>From Location</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data_val.sto_from_location_fgsto}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>To Location</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data_val.sto_to_location_fgsto}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>Delivery Qty in MTS</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data_val.sto_delivery_quantity_fgsto}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>Freight Amount</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data_val.sto_freight_amount_fgsto}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel>Delivery Date and Time</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type="datetime-local"
                                    name="sto_delivery_date_time_fgsto"
                                    // value={stoValuesRMSTO[index_val].sto_delivery_date_time_rmsto}
                                    onChange={(e) => handleStoValueChangeFGSTO(e, index_val)}
                                  />
                                </CCol>
                                {stoValuesFGSTO && stoValuesFGSTO.length > 0 && (
                                  <CCol xs={12} md={2}>
                                    <CFormLabel>POD Copy</CFormLabel>{' '}
                                    {/* Own Vehicle FGSTO POD Copy - OVRPC */}
                                    <CButton
                                      className="w-100 m-0"
                                      color="info"
                                      size="sm"
                                      id="inputAddress"
                                    >
                                      {/* {//console.log(stoValuesRMSTO,'stoValuesRMSTO')} */}
                                      {!(
                                        stoValuesFGSTO[index_val] &&
                                        stoValuesFGSTO[index_val].sto_pod_copy_fgsto_file_upload
                                      ) ? (
                                        <>
                                          <span
                                            className="float-start"
                                            onClick={() => {
                                              uploadClick(index_val)
                                            }}
                                          >
                                            <CIcon
                                              style={{ color: 'red' }}
                                              icon={icon.cilFolderOpen}
                                              size="lg"
                                            />
                                            &nbsp;Upload
                                          </span>
                                          <span
                                            style={{ marginRight: '10%' }}
                                            className="mr-10 float-end"
                                            onClick={() => {
                                              setFileImageKey(index_val)
                                              setCamEnableType('fgsto')
                                              setCamEnable(true)
                                            }}
                                          >
                                            <CIcon
                                              style={{ color: 'red' }}
                                              icon={icon.cilCamera}
                                              size="lg"
                                            />
                                            &nbsp;Camera
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <span className="float-start">
                                            &nbsp;
                                            {stoValuesFGSTO[index_val]
                                              ? stoValuesFGSTO[index_val]
                                                  .sto_pod_copy_fgsto_file_name
                                              : ''}
                                          </span>
                                          <span className="float-end">
                                            <i
                                              className="fa fa-trash"
                                              aria-hidden="true"
                                              onClick={() => {
                                                clearValues(index_val, 'fgsto')
                                              }}
                                            ></i>
                                          </span>
                                        </>
                                      )}
                                    </CButton>
                                    <CFormInput
                                      onBlur={onBlur}
                                      onChange={(e) => handleStoFileUploadChangeFGSTO(e, index_val)}
                                      type="file"
                                      accept=".jpg,.jpeg,.png,.pdf"
                                      name={'sto_pod_copy_fgsto'}
                                      size="sm"
                                      id={`sto_pod_copy_fgsto_upload_yes_${index_val}`}
                                      style={{ display: 'none' }}
                                    />
                                  </CCol>
                                )}

                                {/* Without Camera : Own Vehicle RMSTO POD Copy - OVRPC */}
                                {/* <CCol xs={12} md={2} style={{display:'none'}}>
                                <CFormLabel>POD Copy</CFormLabel>
                                <CFormInput
                                  type="file"
                                  size="sm"
                                  accept=".jpg,.jpeg,.png,.pdf"
                                  name="sto_pod_copy_rmsto"
                                  onChange={(e) => handleStoFileUploadChangeRMSTO(e, index_val)}
                                />
                              </CCol> */}
                              </CRow>
                              <hr />
                            </>
                          )
                        })}
                      </div>
                    </div>
                  </CTabPane>
                  {/* Hire Vehicle SAP : FGSTO Info Tab END====================================== */}
                  {/* ===== Hire Vehicle Others Info Tab START ASK3 ===== */}
                  <CTabPane
                    role="tabpanel"
                    aria-labelledby="profile-tab"
                    visible={activeKey === 10}
                  >
                    <div className="App">
                      <div>
                        <CRow className="mt-2">
                          <CCol xs={12} md={2}>
                            <CFormLabel htmlFor="ot_veh_insurence_valid">
                              Process Type
                              <REQ />{' '}
                            </CFormLabel>
                            {!stoOthersDeliveryEdit && (
                              <>
                                <CFormSelect
                                  size="sm"
                                  name="ot_process_type"
                                  id="ot_process_type"
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                  onChange={handleChange}
                                  value={values.ot_process_type}
                                >
                                  <option value="">Select ...</option>
                                  <option value="1">Returnable No.</option>
                                  <option value="2">Non Returnable No.</option>
                                  <option value="3">Returnable Receipt No.</option>
                                  <option value="4">Purchase PO No.</option>
                                  <option value="5">STO PO No.</option>
                                  <option value="6">Delivery No.</option>
                                  <option value="7">Purchase Migo No.</option>
                                  <option value="8">STO Migo No.</option>
                                  <option value="9">FG-Sales Return / Credit Memo No.</option>
                                  <option value="10">RM Sales / Bill Of Supply No.</option>
                                  {/* <option value="11">Gate Pass No.</option> */}
                                  <option value="12">Delivery Challan No.</option>
                                </CFormSelect>
                              </>
                            )}
                            {stoOthersDeliveryEdit && (
                              <CFormInput
                                size="sm"
                                value={stoOthersValues.others_sto_process_type}
                                id="others_sto_process_type"
                                readOnly
                              />
                            )}
                          </CCol>
                          {values.ot_process_type != '' && (
                            <>
                              <CCol md={2}>
                                <CFormLabel>
                                  Document Number <REQ />
                                </CFormLabel>
                                <CInputGroup>
                                  {!stoOthersDeliveryEdit && (
                                    <>
                                      <CFormInput
                                        size="sm"
                                        value={stoOthersValues.others_sto_doc_number}
                                        onChange={(e) => handleStoOthersValueChange(e)}
                                        name={'others_sto_doc_number'}
                                        // maxLength={values.ot_process_type == 11 ? 14 : 10}
                                        maxLength={12}
                                      />
                                      <CInputGroupText className="p-0">
                                        <CButton
                                          size="sm"
                                          color="success"
                                          onClick={(e) => {
                                            setFetch(false)
                                            getOthersSapData(e)
                                          }}
                                        >
                                          <i className="fa fa-check px-1"></i>
                                        </CButton>
                                      </CInputGroupText>
                                    </>
                                  )}
                                  {stoOthersDeliveryEdit && (
                                    <CFormInput
                                      size="sm"
                                      value={stoOthersValues.others_sto_doc_number}
                                      id="others_sto_doc_number"
                                      readOnly
                                    />
                                  )}
                                </CInputGroup>
                              </CCol>
                              <CCol md={2}>
                                <CFormLabel>Doc. date</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  value={stoOthersValues.others_sto_doc_date || '-'}
                                  name={others_sto_doc_date}
                                  maxLength={1}
                                  readOnly
                                />
                              </CCol>
                              <CCol md={2}>
                                <CFormLabel>
                                  STO PO Number <REQ />
                                </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  value={stoOthersValues.others_sto_po_number || '-'}
                                  name={others_sto_po_number}
                                  maxLength={1}
                                  readOnly
                                />
                              </CCol>
                              <CCol md={2}>
                                <CFormLabel>
                                  Vendor Code <REQ />
                                </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  value={stoOthersValues.others_sto_vendor_code || '-'}
                                  name={others_sto_vendor_code}
                                  maxLength={1}
                                  readOnly
                                />
                              </CCol>
                              <CCol md={2}>
                                <CFormLabel>
                                  Vendor name <REQ />
                                </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  value={stoOthersValues.others_sto_vendor_name || '-'}
                                  name={others_sto_vendor_name}
                                  maxLength={1}
                                  readOnly
                                />
                              </CCol>
                              <CCol md={2}>
                                <CFormLabel>
                                  From Plant Code <REQ />
                                </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  value={stoOthersValues.others_sto_from_plant_code || '-'}
                                  name={others_sto_from_plant_code}
                                  maxLength={1}
                                  readOnly
                                />
                              </CCol>
                              <CCol md={2}>
                                <CFormLabel>
                                  From Plant name <REQ />
                                </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  value={stoOthersValues.others_sto_from_plant_name || '-'}
                                  name={others_sto_from_plant_name}
                                  maxLength={1}
                                  readOnly
                                />
                              </CCol>
                              <CCol md={2}>
                                <CFormLabel>
                                  To Plant Code <REQ />
                                </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  value={stoOthersValues.others_sto_to_plant_code || '-'}
                                  name={others_sto_to_plant_code}
                                  maxLength={1}
                                  readOnly
                                />
                              </CCol>
                              <CCol md={2}>
                                <CFormLabel>
                                  To Plant name <REQ />
                                </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  value={stoOthersValues.others_sto_to_plant_name || '-'}
                                  name={others_sto_to_plant_name}
                                  maxLength={1}
                                  readOnly
                                />
                              </CCol>
                              <CCol md={2}>
                                <CFormLabel>
                                  Inco term <REQ />
                                </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  value={stoOthersValues.others_sto_incoterm || '-'}
                                  name={others_sto_incoterm}
                                  maxLength={1}
                                  readOnly
                                />
                              </CCol>
                              <CCol md={2}>
                                <CFormLabel>
                                  Net Weight <REQ />
                                </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  value={stoOthersValues.others_sto_net_weight || '-'}
                                  name={others_sto_net_weight}
                                  maxLength={1}
                                  readOnly
                                />
                              </CCol>
                              <CCol md={2}>
                                <CFormLabel>
                                  Customer Code
                                  <REQ />
                                </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  value={stoOthersValues.others_sto_customer_code || '-'}
                                  name={others_sto_customer_code}
                                  maxLength={1}
                                  readOnly
                                />
                              </CCol>

                              <CCol md={2}>
                                <CFormLabel>
                                  Assignment <REQ />
                                </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  value={stoOthersValues.others_sto_assignment || '-'}
                                  name={others_sto_assignment}
                                  maxLength={1}
                                  readOnly
                                />
                              </CCol>

                              <CCol md={2}>
                                <CFormLabel>
                                  VA number <REQ />
                                </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  value={stoOthersValues.others_sto_va_no || '-'}
                                  name={others_sto_va_no}
                                  maxLength={1}
                                  readOnly
                                />
                              </CCol>

                              <CCol md={2}>
                                <CFormLabel>
                                  Truck no <REQ />
                                </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  value={stoOthersValues.others_sto_truck_no || '-'}
                                  name={others_sto_truck_no}
                                  maxLength={1}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={2}>
                                <CFormLabel>
                                  Delivery Qty in MTS <REQ />
                                </CFormLabel>

                                <CFormInput
                                  size="sm"
                                  // type="number"
                                  value={
                                    stoOthersValues.others_sto_delivery_quantity
                                      ? stoOthersValues.others_sto_delivery_quantity
                                      : stoDeliveryEdit
                                      ? stoValues.others_sto_delivery_quantity
                                      : ''
                                  }
                                  onChange={(e) => handleStoOthersValueChange(e)}
                                  name={others_sto_delivery_quantity}
                                  maxLength={5}
                                />
                              </CCol>
                              <CCol xs={12} md={2}>
                                <CFormLabel>
                                  Inc.Freight Amount <REQ />
                                </CFormLabel>

                                <CFormInput
                                  size="sm"
                                  value={
                                    stoOthersValues.others_sto_freight_amount
                                      ? stoOthersValues.others_sto_freight_amount
                                      : stoDeliveryEdit
                                      ? stoValues.freight_amount
                                      : ''
                                  }
                                  onChange={(e) => handleStoOthersValueChange(e)}
                                  name={others_sto_freight_amount}
                                  maxLength={6}
                                />
                              </CCol>
                              {/* <CCol xs={12} md={2}>
                              <CFormLabel>Delivery Date and Time</CFormLabel>

                              <CFormInput
                                size="sm"
                                type="datetime-local"
                                value={
                                  stoValues.others_sto_delivered_date
                                    ? stoValues.others_sto_delivered_date
                                    : stoDeliveryEdit
                                    ? stoValues.delivered_date_time
                                    : ''
                                }
                                onChange={(e) => handleStoValueChange(e)}
                                name={others_sto_delivered_date}
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel>POD Copy</CFormLabel>
                              {stoFileUploadVisible ? (
                                <CFormInput
                                  type="file"
                                  size="sm"
                                  value={stoValues.sto_pod_copy}
                                  // onChange={(e) => handleStoValueChange(e)}
                                  onChange={(e) => handleStoFileUploadChange(e)}
                                  name={sto_pod_copy}
                                />
                              ) : (
                                <CButton className="w-100 m-0" color="info" size="sm" id="dInvoice">
                                  <span className="float-start" onClick={() => setStoPodVisible(true)}>
                                    <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                                  </span>
                                  <span
                                    className="float-end"
                                    onClick={() => {
                                      if (window.confirm('Are you sure to remove this file?')) {
                                        stoPodUploadResetEdit()
                                      }
                                    }}
                                  >
                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                  </span>
                                </CButton>
                              )}
                            </CCol> */}
                            </>
                          )}

                          {/* <CCol md={2}>
                          <CFormLabel>
                            Driver Name <REQ />{' '}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            value={stoValues.sto_delivery_driver_name}
                            onChange={(e) => handleStoValueChange(e)}
                            name={sto_delivery_driver_name}
                          >
                            <AllDriverListNameSelectComponent />
                          </CFormSelect>{' '}
                        </CCol> */}
                          {/* <CCol xs={12} md={2}>
                          <CFormLabel>Expense To Be Capture</CFormLabel>

                          <CTableDataCell scope="row">
                            <input
                              className="form-check-input"
                              style={{ minHeight: '18px !important' }}
                              type="checkbox"
                              checked={stoValues.sto_delivery_expense_capture}
                              value={stoValues.sto_delivery_expense_capture}
                              onChange={(e) => handleStoExpenseCaptureChange(e)}
                              name={sto_delivery_expense_capture}
                            />
                          </CTableDataCell>
                        </CCol> */}
                        </CRow>
                      </div>
                    </div>

                    {stoOthersTableData && (stoOthersTableData.length < 1 || isOthersStoEditMode) && (
                      <div
                        className="App"
                        style={{ display: 'flex', flexDirection: 'row-reverse' }}
                      >
                        <CButton
                          className="m-2"
                          disabled={!isOthersStoEditMode && stoOthersDeliveryInvalid ? true : false}
                          onClick={(e) =>
                            onOthersStoSubmitBtn(e, isOthersStoEditMode ? 'Update' : 'Add')
                          }
                          // onClick={onOthersStoSubmitBtn}
                          color="primary"
                        >
                          {isOthersStoEditMode ? 'Update' : 'Add'}
                        </CButton>{' '}
                        <CButton
                          className="m-2"
                          onClick={onOthersStoSubmitCancelBtn}
                          color="primary"
                        >
                          Clear
                        </CButton>
                        {isOthersStoEditMode && (
                          <CButton className="m-2" onClick={stoOthersResetEdit} color="primary">
                            Cancel Edit
                          </CButton>
                        )}
                        <br />
                      </div>
                    )}
                    <hr />
                    <StoTableOthersComponent
                      stoOthersTableData={stoOthersTableData}
                      tripInfo={tripInfo}
                      title="Others Information Table"
                      onEdit={onOthersStoEditcallback}
                      onDelete={onOthersStoDeleteCallback}
                      isOthersStoEditMode={isOthersStoEditMode}
                      hireVehicle={
                        tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id &&
                        tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id == 22
                          ? true
                          : false
                      }
                    />
                  </CTabPane>
                  {/* ===== HIre Vehicle Others Info Tab END ASK4 ===== */}
                  {/* Hire Vehicle FG-STO Info Tab START================================ */}
                  <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 4}>
                    <div className="App">
                      <div>
                        <CRow className="mt-2">
                          {/* <CCol md={2}>
                          <CFormLabel>
                            STO Delivery Number <REQ />
                          </CFormLabel>
                          <CFormInput
                            size="sm"
                            value={stoValues.sto_delivery_number}
                            onChange={(e) => handleStoValueChange(e)}
                            name={sto_delivery_number}
                            maxLength={10}
                          />
                        </CCol> */}
                          <CCol md={2}>
                            <CFormLabel>
                              STO Delivery Number <REQ />
                            </CFormLabel>
                            <CInputGroup>
                              {!stoDeliveryEdit && (
                                <>
                                  <CFormInput
                                    size="sm"
                                    value={stoValues.sto_delivery_number}
                                    onChange={(e) => handleStoValueChange(e)}
                                    name={sto_delivery_number}
                                    maxLength={10}
                                  />
                                  <CInputGroupText className="p-0">
                                    <CButton
                                      size="sm"
                                      color="success"
                                      onClick={(e) => getStoDeliveryData(e)}
                                    >
                                      <i className="fa fa-check px-1"></i>
                                    </CButton>
                                  </CInputGroupText>
                                </>
                              )}
                              {stoDeliveryEdit && (
                                <CFormInput
                                  size="sm"
                                  value={stoValues.sto_delivery_number || stoValues.sto_delivery_no}
                                  id="sto_delivery_number"
                                  readOnly
                                />
                              )}
                            </CInputGroup>
                          </CCol>
                          <CCol md={2}>
                            <CFormLabel>
                              STO PO Number <REQ />
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              value={
                                stoValues.sto_po_number
                                  ? stoValues.sto_po_number
                                  : stoDeliveryEdit
                                  ? stoValues.sto_po_no
                                  : ''
                              }
                              // value={
                              //   stoValues.sto_po_number || stoDeliveryEdit ? stoValues.sto_po_no : ''
                              // }
                              // onChange={(e) => handleStoValueChange(e)}
                              name={sto_po_number}
                              maxLength={10}
                              readOnly
                            />
                          </CCol>
                          <CCol md={2}>
                            <CFormLabel>Division</CFormLabel>
                            <CFormInput
                              size="sm"
                              value={stoValues.sto_delivery_division}
                              // onChange={(e) => handleStoValueChange(e)}
                              name={sto_delivery_division}
                              maxLength={1}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={2}>
                            <CFormLabel>
                              From Location <REQ />
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              value={
                                stoValues.sto_from_location
                                  ? location_name(stoValues.sto_from_location)
                                  : stoDeliveryEdit
                                  ? location_name(stoValues.from_location)
                                  : ''
                              }
                              // onChange={(e) => handleStoValueChange(e)}
                              name={sto_from_location}
                              maxLength={30}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={2}>
                            <CFormLabel>
                              To Location <REQ />
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              value={
                                stoValues.sto_to_location
                                  ? location_name(stoValues.sto_to_location)
                                  : stoDeliveryEdit
                                  ? location_name(stoValues.to_location)
                                  : ''
                              }
                              // onChange={(e) => handleStoValueChange(e)}
                              name={sto_to_location}
                              maxLength={30}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={2}>
                            <CFormLabel>
                              Delivery Qty in MTS <REQ />
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              // type="number"
                              value={
                                stoValues.sto_delivery_quantity
                                  ? stoValues.sto_delivery_quantity
                                  : stoDeliveryEdit
                                  ? stoValues.sto_delivery_quantity
                                  : ''
                              }
                              // onChange={(e) => handleStoValueChange(e)}
                              name={sto_delivery_quantity}
                              maxLength={5}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={2}>
                            <CFormLabel>
                              Freight Amount <REQ />
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              value={
                                stoValues.sto_freight_amount
                                  ? stoValues.sto_freight_amount
                                  : stoDeliveryEdit
                                  ? stoValues.freight_amount
                                  : ''
                              }
                              // onChange={(e) => handleStoValueChange(e)}
                              name={sto_freight_amount}
                              maxLength={6}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={2}>
                            <CFormLabel>Delivery Date and Time</CFormLabel>

                            <CFormInput
                              size="sm"
                              type="datetime-local"
                              value={
                                stoValues.sto_delivery_date_time
                                  ? stoValues.sto_delivery_date_time
                                  : stoDeliveryEdit
                                  ? stoValues.delivered_date_time
                                  : ''
                              }
                              onChange={(e) => handleStoValueChange(e)}
                              name={sto_delivery_date_time}
                            />
                          </CCol>
                          <CCol xs={12} md={2}>
                            <CFormLabel>POD Copy</CFormLabel>
                            {stoFileUploadVisible ? (
                              <CFormInput
                                type="file"
                                size="sm"
                                value={stoValues.sto_pod_copy}
                                // onChange={(e) => handleStoValueChange(e)}
                                onChange={(e) => handleStoFileUploadChange(e)}
                                name={sto_pod_copy}
                              />
                            ) : (
                              <CButton className="w-100 m-0" color="info" size="sm" id="dInvoice">
                                <span
                                  className="float-start"
                                  onClick={() => setStoPodVisible(true)}
                                >
                                  <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                                </span>
                                <span
                                  className="float-end"
                                  onClick={() => {
                                    if (window.confirm('Are you sure to remove this file?')) {
                                      stoPodUploadResetEdit()
                                    }
                                  }}
                                >
                                  <i className="fa fa-trash" aria-hidden="true"></i>
                                </span>
                              </CButton>
                            )}
                          </CCol>

                          {/* <CCol md={2}>
                          <CFormLabel>
                            Driver Name <REQ />{' '}
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            value={stoValues.sto_delivery_driver_name}
                            onChange={(e) => handleStoValueChange(e)}
                            name={sto_delivery_driver_name}
                          >
                            <AllDriverListNameSelectComponent />
                          </CFormSelect>{' '}
                        </CCol> */}
                          {/* <CCol xs={12} md={2}>
                          <CFormLabel>Expense To Be Capture</CFormLabel>

                          <CTableDataCell scope="row">
                            <input
                              className="form-check-input"
                              style={{ minHeight: '18px !important' }}
                              type="checkbox"
                              checked={stoValues.sto_delivery_expense_capture}
                              value={stoValues.sto_delivery_expense_capture}
                              onChange={(e) => handleStoExpenseCaptureChange(e)}
                              name={sto_delivery_expense_capture}
                            />
                          </CTableDataCell>
                        </CCol> */}

                          <CCol xs={12} md={2}>
                            {' '}
                          </CCol>
                          <CCol xs={12} md={2}>
                            {' '}
                          </CCol>
                          <CCol xs={12} md={2}>
                            {' '}
                          </CCol>
                        </CRow>
                      </div>
                    </div>

                    {stoTableData && (stoTableData.length < 1 || isStoEditMode) && (
                      <div
                        className="App"
                        style={{ display: 'flex', flexDirection: 'row-reverse' }}
                      >
                        <CButton
                          className="m-2"
                          disabled={!isStoEditMode && stoDeliveryInvalid ? true : false}
                          onClick={onStoSubmitBtn}
                          color="primary"
                        >
                          {isStoEditMode ? 'Update' : 'Add'}
                        </CButton>{' '}
                        <CButton className="m-2" onClick={onStoSubmitCancelBtn} color="primary">
                          Clear
                        </CButton>
                        {isStoEditMode && (
                          <CButton className="m-2" onClick={stoResetEdit} color="primary">
                            Cancel Edit
                          </CButton>
                        )}
                        <br />
                      </div>
                    )}
                    <hr />
                    <StoTableComponent
                      stoTableData={stoTableData}
                      title="STO Information Table"
                      onEdit={onStoEditcallback}
                      onDelete={onStoDeleteCallback}
                      isStoEditMode={isStoEditMode}
                      hireVehicle={
                        tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id &&
                        tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id == 22
                          ? true
                          : false
                      }
                    />
                  </CTabPane>
                  {/* HIre Vehicle FG-STO Info Tab END ===============================*/}
                  {/* Hire Vehicle RMSTO Info Tab START================================ */}
                  <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 8}>
                    <div className="App">
                      <div>
                        {stoTableDataRMSTO.length == 0 && (
                          <>
                            <div className="m-5">
                              <h2>There are no delivery records to display..</h2>
                            </div>
                          </>
                        )}
                        {stoTableDataRMSTO.map((data_val, index_val) => {
                          //console.log(data_val, 'data_val-stoTableDataRMSTO.map hire')
                          return (
                            <>
                              <CRow className="mt-2" key={`rmsto_data_${index_val}`}>
                                <CCol md={2}>
                                  <CFormLabel>STO Delivery Number</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data_val.sto_delivery_number_rmsto}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>STO PO Number</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data_val.sto_po_number_rmsto}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>Division</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data_val.sto_delivery_division_rmsto}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>From Location</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data_val.sto_from_location_rmsto}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>To Location</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data_val.sto_to_location_rmsto}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>Delivery Qty in MTS</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data_val.sto_delivery_quantity_rmsto}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>Freight Amount</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data_val.sto_freight_amount_rmsto}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel>Delivery Date and Time</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type="datetime-local"
                                    name="sto_delivery_date_time_rmsto"
                                    // value={stoValuesRMSTO[index_val].sto_delivery_date_time_rmsto}
                                    onChange={(e) => handleStoValueChangeRMSTO(e, index_val)}
                                  />
                                </CCol>
                                {stoValuesRMSTO && stoValuesRMSTO.length > 0 && (
                                  <CCol xs={12} md={2}>
                                    <CFormLabel>POD Copy</CFormLabel>{' '}
                                    {/* Hire Vehicle RMSTO POD Copy - HVRPC */}
                                    <CButton
                                      className="w-100 m-0"
                                      color="info"
                                      size="sm"
                                      id="inputAddress"
                                    >
                                      {console.log(
                                        stoValuesRMSTO,
                                        'stoValuesRMSTO - Hire Vehicle RMSTO POD Copy - HVRPC'
                                      )}
                                      {!(
                                        stoValuesRMSTO[index_val] &&
                                        stoValuesRMSTO[index_val].sto_pod_copy_rmsto_file_upload
                                      ) ? (
                                        <>
                                          <span
                                            className="float-start"
                                            onClick={() => {
                                              uploadClick(index_val)
                                            }}
                                          >
                                            <CIcon
                                              style={{ color: 'red' }}
                                              icon={icon.cilFolderOpen}
                                              size="lg"
                                            />
                                            &nbsp;Upload
                                          </span>
                                          <span
                                            style={{ marginRight: '10%' }}
                                            className="mr-10 float-end"
                                            onClick={() => {
                                              setFileImageKey(index_val)
                                              setCamEnableType('rmsto')
                                              setCamEnable(true)
                                            }}
                                          >
                                            <CIcon
                                              style={{ color: 'red' }}
                                              icon={icon.cilCamera}
                                              size="lg"
                                            />
                                            &nbsp;Camera
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <span className="float-start">
                                            &nbsp;
                                            {stoValuesRMSTO[index_val]
                                              ? stoValuesRMSTO[index_val]
                                                  .sto_pod_copy_rmsto_file_name
                                              : ''}
                                          </span>
                                          <span className="float-end">
                                            <i
                                              className="fa fa-trash"
                                              aria-hidden="true"
                                              onClick={() => {
                                                clearValues(index_val, 'rmsto')
                                              }}
                                            ></i>
                                          </span>
                                        </>
                                      )}
                                    </CButton>
                                    <CFormInput
                                      onBlur={onBlur}
                                      onChange={(e) => handleStoFileUploadChangeRMSTO(e, index_val)}
                                      type="file"
                                      accept=".jpg,.jpeg,.png,.pdf"
                                      name={'sto_pod_copy_rmsto'}
                                      size="sm"
                                      id={`sto_pod_copy_rmsto_upload_yes_${index_val}`}
                                      style={{ display: 'none' }}
                                    />
                                  </CCol>
                                )}

                                {/* Without Camera : Own Vehicle RMSTO POD Copy - OVRPC */}
                                {/* <CCol xs={12} md={2} style={{display:'none'}}>
                                        <CFormLabel>POD Copy</CFormLabel>
                                        <CFormInput
                                          type="file"
                                          size="sm"
                                          accept=".jpg,.jpeg,.png,.pdf"
                                          name="sto_pod_copy_rmsto"
                                          onChange={(e) => handleStoFileUploadChangeRMSTO(e, index_val)}
                                        />
                                      </CCol> */}
                              </CRow>
                              <hr />
                            </>
                          )
                        })}
                      </div>
                    </div>
                  </CTabPane>
                  {/* ==================== Hire Vehicle RMSO Info Tab END =================== */}

                  {/* ==================== Hire Vehicle Freight Tab Start ==================== */}
                  <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 7}>
                    {incotermFreightInfo.length > 0 && tripInfo.tripsheet_info.to_divison == 1 && (
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
                              {incotermFreightInfo.map((data, index) => {
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
                          {tripInfo && tripInfo.vehicle_info.vehicle_type_id === 22 && (
                            <>
                              {shipmentInfo.map((data, index) => {
                                return (
                                  <CTableDataCell key={`freight_rate${index}`}>
                                    <CFormInput
                                      size="sm"
                                      id={`freight_rate${index}`}
                                      maxLength={5}
                                      name={`freight_rate${index}`}
                                      value={
                                        tripInfo.tripsheet_info.trip_vehicle_route.freight_rate
                                          ? tripInfo.tripsheet_info.trip_vehicle_route.freight_rate
                                          : '0'
                                      }
                                      readOnly
                                    />
                                  </CTableDataCell>
                                )
                              })}
                              {shipmentInfo.map((data, index) => {
                                return (
                                  <CTableDataCell key={`billed_qty${index}`}>
                                    <CFormInput
                                      size="sm"
                                      id={`billed_qty${index}`}
                                      maxLength={5}
                                      name={`billed_qty${index}`}
                                      value={
                                        tripInfo.vehicle_assignment[0]?.billed_qty
                                          ? tripInfo.vehicle_assignment[0].billed_qty
                                          : '0'
                                      }
                                      readOnly
                                    />
                                  </CTableDataCell>
                                )
                              })}

                              {shipmentInfo.map((data, index) => {
                                return (
                                  <CTableDataCell key={`total_freight_amt${index}`}>
                                    <CFormInput
                                      size="sm"
                                      id={`total_freight_amt${index}`}
                                      maxLength={5}
                                      name={`total_freight_amt${index}`}
                                      value={
                                        tripInfo.vehicle_assignment[0]?.billed_qty *
                                        tripInfo.tripsheet_info.trip_vehicle_route.freight_rate
                                      }
                                      readOnly
                                    />
                                  </CTableDataCell>
                                )
                              })}

                              <CTableDataCell key={`freight_total_advance_amount_data`}>
                                <CFormInput
                                  size="sm"
                                  id={`freight_total_advance_amount`}
                                  maxLength={5}
                                  name={`freight_total_advance_amount`}
                                  value={advance_total_amount}
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
                                  value={
                                    tripInfo.vehicle_assignment[0]?.billed_qty *
                                      tripInfo.tripsheet_info.trip_vehicle_route.freight_rate -
                                    advance_total_amount
                                  }
                                  readOnly
                                />
                              </CTableDataCell>
                            </>
                          )}

                          {tripInfo && tripInfo.vehicle_info.vehicle_type_id === 21 && (
                            <>
                              <CTableDataCell key={`freight_diesel_advance_amount_data`}>
                                <CFormInput
                                  size="sm"
                                  id={`freight_diesel_advance_amount`}
                                  maxLength={5}
                                  name={`freight_diesel_advance_amount`}
                                  value={
                                    tripInfo.diesel_intent_info
                                      ? tripInfo.diesel_intent_info.total_amount
                                      : 0
                                  }
                                  readOnly
                                />
                              </CTableDataCell>

                              {/* Freight : Advance in Diesel Part End */}
                              {/* Freight : Advance in Bank Part Start */}

                              <CTableDataCell key={`freight_bank_advance_amount_data`}>
                                <CFormInput
                                  size="sm"
                                  id={`freight_bank_advance_amount`}
                                  maxLength={5}
                                  name={`freight_bank_advance_amount`}
                                  value={
                                    tripInfo.advance_payment_info
                                      ? tripInfo.advance_payment_info.advance_payment
                                      : 0
                                  }
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
                      <CTable caption="top" hover style={{ height: '55vh' }}>
                        <CTableCaption style={{ color: 'maroon' }}>Expenses</CTableCaption>

                        {/* ================== Expense Table Header Part Start ====================== */}
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

                            <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                              Expense Amount
                            </CTableHeaderCell>

                            <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                              Total Expense Amount
                            </CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        {/* ================== Expense Table Header Part End ======================= */}
                        {/* ================== Expense Table Body Part Start ======================= */}
                        <CTableBody>
                          {/* ================== Nlmt Freight Charges Part Start ======================= */}
                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>1</b>
                            </CTableDataCell>
                            {tripInfo && tripInfo.vehicle_info.vehicle_type_id === 22 && (
                              <>
                                <CTableDataCell>Freight Charges</CTableDataCell>
                                <CTableDataCell>
                                  {tripInfo.vehicle_info && tripInfo.vehicle_info && (
                                    <>
                                      <CFormInput
                                        id="freight_charges"
                                        value={
                                          tripInfo.vehicle_assignment[0]?.billed_qty *
                                          tripInfo.tripsheet_info.trip_vehicle_route.freight_rate
                                        }
                                        readOnly
                                      />
                                    </>
                                  )}
                                  {tripInfo.advance_payment_info ? (
                                    <>
                                      <CFormInput
                                        size="sm"
                                        id="freight_charges"
                                        name="freight_charges"
                                        value={advance_total_amount || 0}
                                        readOnly
                                      />
                                    </>
                                  ) : (
                                    <>
                                      {!tripInfo.advance_payment_info &&
                                      idt.length > 0 &&
                                      tripInfo.tripsheet_info ? (
                                        <>
                                          {/* <CFormInput
                                            size="sm"
                                            id="freight_charges"
                                            name="freight_charges"
                                            value={totalvaluefinder(2, tripInfo.shipment_info[0])}
                                            //value={'1'}
                                            readOnly
                                          /> */}
                                        </>
                                      ) : (
                                        <>
                                          {/* <CFormInput
                                            className={`${errors.freight_charges && 'is-invalid'}`}
                                            id="freight_charges"
                                            name="freight_charges"
                                            maxLength={5}
                                            onFocus={onFocus}
                                            onBlur={onBlur}
                                            onChange={handleChange}
                                            required={errors.freight_charges ? true : false}
                                            size="sm"
                                            // value={values.freight_charges}
                                            // value={totalCharges}
                                          /> */}
                                          {errors.freight_charges && (
                                            <span className="small text-danger">
                                              {errors.freight_charges}
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </>
                                  )}
                                </CTableDataCell>
                                <CTableDataCell scope="row">
                                  <CFormInput
                                    size="sm"
                                    id="expense_row_total_freight_charge"
                                    name="expense_row_total_freight_charge"
                                    // value={
                                    //   errors.freight_charges
                                    //     ? 0
                                    //     : values.freight_charges
                                    //     ? Number(values.freight_charges)
                                    //     : Number(
                                    //         tripInfo.vehicle_assignment[0]?.billed_qty *
                                    //           tripInfo.tripsheet_info.trip_vehicle_route
                                    //             .freight_rate || 1
                                    //       )
                                    // }
                                    value={
                                      tripInfo.vehicle_assignment[0]?.billed_qty *
                                      tripInfo.tripsheet_info.trip_vehicle_route.freight_rate
                                    }
                                    // value={values.freight_charges}
                                    readOnly
                                  />
                                </CTableDataCell>
                              </>
                            )}
                            {tripInfo && tripInfo.vehicle_info.vehicle_type_id === 21 && (
                              <>
                                <CTableDataCell>Freight Charges</CTableDataCell>
                                <CTableDataCell>
                                  {tripInfo.vehicle_info && tripInfo.vehicle_info && (
                                    <>
                                      <CFormInput
                                        id="freight_charges"
                                        value={
                                          values.freight_charges
                                            ? values.freight_charges
                                            : tripInfo.advance_payment_info
                                            ? tripInfo.advance_payment_info.actual_freight
                                            : ''
                                        }
                                        readOnly
                                      />
                                    </>
                                  )}
                                  {tripInfo.advance_info ? (
                                    <>
                                      <CFormInput
                                        size="sm"
                                        id="freight_charges"
                                        name="freight_charges"
                                        // value={tripInfo.advance_info.actual_freight}
                                        value="5"
                                        readOnly
                                      />
                                    </>
                                  ) : (
                                    <>
                                      {!tripInfo.advance_payment_info &&
                                      idt.length > 0 &&
                                      tripInfo.tripsheet_info.to_divison == 1 ? (
                                        <>
                                          <CFormInput
                                            size="sm"
                                            id="freight_charges"
                                            name="freight_charges"
                                            value={totalvaluefinder(2, tripInfo.shipment_info[0])}
                                            readOnly
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <CFormInput
                                            className={`${errors.freight_charges && 'is-invalid'}`}
                                            id="freight_charges"
                                            name="freight_charges"
                                            maxLength={5}
                                            onFocus={onFocus}
                                            onBlur={onBlur}
                                            onChange={handleChange}
                                            required={errors.freight_charges ? true : false}
                                            size="sm"
                                            value={values.freight_charges}
                                            //value={totalCharges}
                                            readOnly
                                          />
                                          {errors.freight_charges && (
                                            <span className="small text-danger">
                                              {errors.freight_charges}
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </>
                                  )}
                                </CTableDataCell>
                                <CTableDataCell scope="row">
                                  <CFormInput
                                    size="sm"
                                    id="expense_row_total_freight_charge"
                                    name="expense_row_total_freight_charge"
                                    value={
                                      errors.freight_charges
                                        ? 0
                                        : values.freight_charges
                                        ? Number(values.freight_charges)
                                        : tripInfo.advance_payment_info // ← mirror the Expense Amount fallback
                                        ? Number(tripInfo.advance_payment_info.actual_freight || 0)
                                        : 0
                                    }
                                    readOnly
                                  />
                                </CTableDataCell>
                              </>
                            )}
                          </CTableRow>
                          {/* ================== Freight Charges Part End ======================= */}

                          {/* ================== Low Tonnage Charges Part Start ======================= */}
                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>2</b>
                            </CTableDataCell>
                            <CTableDataCell>Low Tonnage Charges</CTableDataCell>
                            <CTableDataCell>
                              {/* {tripInfo.trip_sheet_info && tripInfo.trip_sheet_info.purpose != 3 && (
                            <>
                              <CFormInput
                                id="freight_charges"
                                value={
                                  values.freight_charges
                                    ? values.freight_charges
                                    : tripInfo.advance_payment_info
                                    ? tripInfo.advance_payment_info.actual_freight
                                    : ''
                                }
                                readOnly
                              />
                            </>
                          )} */}
                              {tripInfo.advance_info &&
                              tripInfo.advance_info.low_tonnage_charges &&
                              Number(tripInfo.advance_info.low_tonnage_charges) > 0 ? (
                                <>
                                  <CFormInput
                                    size="sm"
                                    id="low_tonnage_charges"
                                    name="low_tonnage_charges"
                                    value={tripInfo.advance_info.low_tonnage_charges}
                                    // value="5"
                                    readOnly
                                  />
                                </>
                              ) : (
                                <>
                                  <CFormInput
                                    className={`${errors.low_tonnage_charges && 'is-invalid'}`}
                                    id="low_tonnage_charges"
                                    name="low_tonnage_charges"
                                    maxLength={5}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                    required={errors.low_tonnage_charges ? true : false}
                                    size="sm"
                                    value={values.low_tonnage_charges}
                                    readOnly
                                  />
                                  {errors.low_tonnage_charges && (
                                    <span className="small text-danger">
                                      {errors.low_tonnage_charges}
                                    </span>
                                  )}
                                </>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_low_tonage_freight_charge"
                                name="expense_row_low_tonage_freight_charge"
                                value={
                                  errors.low_tonnage_charges
                                    ? 0
                                    : values.low_tonnage_charges
                                    ? values.low_tonnage_charges
                                    : 0
                                }
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Low Tonnage Charges Part End ======================= */}

                          {/* ================== Unloading Charges Part Start ======================= */}
                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>3</b>
                            </CTableDataCell>
                            <CTableDataCell>Unloading Charges</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={`${errors.unloading_charges && 'is-invalid'}`}
                                id="unloading_charges"
                                name="unloading_charges"
                                maxLength={5}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                required={errors.unloading_charges ? true : false}
                                size="sm"
                                value={values.unloading_charges}
                                readOnly
                              />
                              {errors.unloading_charges && (
                                <span className="small text-danger">
                                  {errors.unloading_charges}
                                </span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_unloading_charge"
                                name="expense_row_total_unloading_charge"
                                value={errors.unloading_charges ? 0 : values.unloading_charges}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Unloading Charges Part End ======================= */}

                          {/* ================== Weighment Charges Part Start ======================= */}
                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>4</b>
                            </CTableDataCell>
                            <CTableDataCell>Weighment Charges</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={
                                  tripInfo.tripsheet_info && tripInfo.tripsheet_info.to_divison == 2
                                    ? ''
                                    : `${errors.weighment_charges && 'is-invalid'}`
                                }
                                id="weighment_charges"
                                name="weighment_charges"
                                maxLength={5}
                                onFocus={
                                  tripInfo.tripsheet_info && tripInfo.tripsheet_info.to_divison == 2
                                    ? undefined
                                    : onFocus
                                }
                                onBlur={
                                  tripInfo.tripsheet_info && tripInfo.tripsheet_info.to_divison == 2
                                    ? undefined
                                    : onBlur
                                }
                                //readOnly={tripInfo.tripsheet_info && tripInfo.tripsheet_info.to_divison == 2 ? true : false}
                                // onChange={handleChange}
                                onChange={
                                  tripInfo.tripsheet_info && tripInfo.tripsheet_info.to_divison == 2
                                    ? ''
                                    : handleChange
                                }
                                required={
                                  tripInfo.tripsheet_info && tripInfo.tripsheet_info.to_divison == 2
                                    ? false
                                    : errors.weighment_charges
                                    ? true
                                    : false
                                }
                                size="sm"
                                value={values.weighment_charges}
                                readOnly
                              />
                              {tripInfo.tripsheet_info &&
                                tripInfo.tripsheet_info.to_divison != 2 &&
                                errors.weighment_charges && (
                                  <span className="small text-danger">
                                    {errors.weighment_charges}
                                  </span>
                                )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_weighment_charge"
                                name="expense_row_total_weighment_charge"
                                value={errors.weighment_charges ? 0 : values.weighment_charges}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Weighment Charges Part End ======================= */}

                          {/* ================== Halting Charges Part Start ======================= */}
                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>5</b>
                            </CTableDataCell>
                            <CTableDataCell>Halting Charges</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={`${errors.halting_charges && 'is-invalid'}`}
                                id="halting_charges"
                                name="halting_charges"
                                maxLength={5}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                required={errors.halting_charges ? true : false}
                                size="sm"
                                value={values.halting_charges}
                                readOnly
                              />
                              {errors.halting_charges && (
                                <span className="small text-danger">{errors.halting_charges}</span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_halting_charge"
                                name="expense_row_total_halting_charge"
                                value={errors.halting_charges ? 0 : values.halting_charges}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Halting Charges Part End ======================= */}

                          {/* ================== Subdelivery Charges Part Start =================== */}
                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>6</b>
                            </CTableDataCell>
                            <CTableDataCell>Subdelivery Charges</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={`${errors.sub_delivery_charges && 'is-invalid'}`}
                                id="sub_delivery_charges"
                                name="sub_delivery_charges"
                                maxLength={5}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                required={errors.sub_delivery_charges ? true : false}
                                size="sm"
                                value={values.sub_delivery_charges}
                                readOnly
                              />
                              {errors.sub_delivery_charges && (
                                <span className="small text-danger">
                                  {errors.sub_delivery_charges}
                                </span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_subdelivery_charge"
                                name="expense_row_total_subdelivery_charge"
                                value={
                                  errors.sub_delivery_charges ? 0 : values.sub_delivery_charges
                                }
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Subdelivery Charges Part End ======================= */}

                          {/* ================== Toll Amount Part Start ======================= */}
                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>7</b>
                            </CTableDataCell>
                            <CTableDataCell>Toll Amount</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={`${errors.toll_amount && 'is-invalid'}`}
                                id="toll_amount"
                                name="toll_amount"
                                maxLength={5}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                required={errors.toll_amount ? true : false}
                                size="sm"
                                value={values.toll_amount}
                                readOnly
                              />
                              {errors.toll_amount && (
                                <span className="small text-danger">{errors.toll_amount}</span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_toll_amount"
                                name="expense_row_total_toll_amount"
                                value={errors.toll_amount ? 0 : values.toll_amount}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Toll Amount Part End ======================= */}

                          {/* ================== Stock Diversion / Return Charges Part Start ========= */}
                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>8</b>
                            </CTableDataCell>
                            <CTableDataCell>Deduction </CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={
                                  tripInfo.tripsheet_info && tripInfo.tripsheet_info.to_divison == 2
                                    ? ''
                                    : `${errors.diversion_return_charges && 'is-invalid'}`
                                }
                                id="diversion_return_charges"
                                name="diversion_return_charges"
                                maxLength={5}
                                //onFocus={tripInfo.tripsheet_info && tripInfo.tripsheet_info.to_divison == 2 ? undefined : onFocus}
                                // onBlur={tripInfo.tripsheet_info && tripInfo.tripsheet_info.to_divison == 2 ? undefined : onBlur}
                                //  readOnly={tripInfo.tripsheet_info && tripInfo.tripsheet_info.to_divison == 2 ? true : false}
                                //  onChange={tripInfo.tripsheet_info && tripInfo.tripsheet_info.to_divison == 2 ? '' : handleChange}
                                // required={tripInfo.tripsheet_info && tripInfo.tripsheet_info.to_divison == 2 ? false : (errors.diversion_return_charges ? true : false)}
                                size="sm"
                                value={values.diversion_return_charges}
                                readOnly
                              />
                              {tripInfo.tripsheet_info && errors.diversion_return_charges && (
                                <span className="small text-danger">
                                  {errors.diversion_return_charges}
                                </span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_stock_return_charge"
                                name="expense_row_total_stock_return_charge"
                                value={
                                  errors.diversion_return_charges
                                    ? 0
                                    : values.diversion_return_charges
                                }
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {values.diversion_return_charges > 0 && (
                            <>
                              <CTableRow style={{ backgroundColor: '#f8d7da' }}>
                                <CTableDataCell scope="row" style={{ width: '120px' }}>
                                  <CFormLabel>Cost Center</CFormLabel>
                                  <CFormSelect
                                    name="cost_center"
                                    // value={values.cost_center}
                                    value={costCenter}
                                    onChange={handleChange}
                                    readOnly
                                  >
                                    <option value="">Select</option>
                                    {costCenterData.map(
                                      ({ definition_list_id, definition_list_name }) => (
                                        <option
                                          key={definition_list_id}
                                          value={String(definition_list_id)}
                                        >
                                          {definition_list_name}
                                        </option>
                                      )
                                    )}
                                  </CFormSelect>
                                </CTableDataCell>
                                <CTableDataCell style={{ width: '180px' }}>
                                  <CFormLabel>
                                    Posting Date
                                    <REQ />
                                  </CFormLabel>

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
                                    readOnly
                                  />
                                </CTableDataCell>
                                <CTableDataCell style={{ width: '180px' }}>
                                  <CFormLabel>Remarks</CFormLabel>
                                  <CFormInput
                                    name="ded_remarks"
                                    // value={values.ded_remarks}
                                    value={dedRemarks}
                                    onChange={handleChange}
                                    readOnly
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            </>
                          )}
                          {/* ================== Stock Diversion / Return Charges Part End ========== */}

                          {/* ================== Total Charges Part Start ============ */}
                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>*</b>
                            </CTableDataCell>
                            <CTableDataCell>Total Trip Additional Charges</CTableDataCell>
                            <CTableDataCell> </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_additional_total_charge"
                                name="expense_row_additional_total_charge"
                                value={totalAdditionalChargesCalculator(
                                  values,
                                  totalChargesCalculator(values)
                                )}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Total Charges Part End ========== */}

                          {/* ================== Total Charges Part Start ============ */}
                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>*</b>
                            </CTableDataCell>
                            <CTableDataCell>Total Trip Expense Charges</CTableDataCell>
                            <CTableDataCell> </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_total_charge"
                                name="expense_row_total_total_charge"
                                value={
                                  totalChargesHire +
                                  tripInfo.vehicle_assignment[0]?.billed_qty *
                                    tripInfo.tripsheet_info.trip_vehicle_route.freight_rate
                                }
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Total Charges Part End ========== */}
                        </CTableBody>
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
                                type="number"
                                maxLength={2}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
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
                          {tripInfo && tripInfo.advance_info && tripInfo.advance_info.tds_type ? (
                            <>
                              <CTableRow>
                                <CTableDataCell scope="row">
                                  <b>2</b>
                                </CTableDataCell>
                                <CTableDataCell>Tds Having</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    size="sm"
                                    value={getTdsTypeHaving(tripInfo.advance_info.tds_type)}
                                    readOnly
                                  />
                                </CTableDataCell>
                              </CTableRow>
                              {tripInfo.advance_info && tripInfo.advance_info.vendor_tds && (
                                <CTableRow>
                                  <CTableDataCell scope="row">
                                    <b>2 A</b>
                                  </CTableDataCell>
                                  <CTableDataCell>Tds Tax Type</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      // value={`${tdsTaxCodeName(tripInfo.advance_info.vendor_tds)}`}
                                      value={tdsType}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </CTableRow>
                              )}
                            </>
                          ) : (
                            <>
                              <CTableRow>
                                <CTableDataCell scope="row">
                                  <b>2</b>
                                </CTableDataCell>
                                <CTableDataCell>Tds Tax Type</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    size="sm"
                                    id="TdsHaving"
                                    name="TdsHaving"
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                    value={getTdsTypeHaving(values.TdsType)}
                                    readOnly
                                    className={`${errors.TdsHaving && 'is-invalid'}`}
                                    aria-label="Small select example"
                                  ></CFormInput>
                                </CTableDataCell>
                              </CTableRow>
                            </>
                          )}
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
                          tripInfo.advance_info &&
                          tripInfo.advance_info.gst_tax_type ? (
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
                                    // value={getHSNTypeDesc(tripInfo.advance_info.vendor_hsn)}
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
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                    value={values.HSNtax}
                                    readOnly
                                    className={`${errors.HSNtax && 'is-invalid'}`}
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
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="remarks">Expense Remarks</CFormLabel>
                          <CFormTextarea
                            name="remarks"
                            id="remarks"
                            rows="1"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            value={values.remarks}
                            readOnly
                          ></CFormTextarea>
                        </CCol>
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
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
                              TripsheetClosureSubmit(settlementAvailable ? 'Approve' : 'Approve')
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
                              TripsheetClosureSubmit(settlementAvailable ? 'reject' : 'reject')
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

              <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={mainKey === 2}>
                {/*  Own / Contract Vehicles Part Header Tab End */}
                <CNav variant="tabs" role="tablist">
                  <CNavItem>
                    <CNavLink
                      style={{ backgroundColor: tabGISuccess ? 'green' : 'red' }}
                      active={activeKey_2 === 1}
                      onClick={() => setActiveKey_2(1)}
                    >
                      General Information
                    </CNavLink>
                  </CNavItem>

                  <CNavItem>
                    <CNavLink
                      style={{
                        backgroundColor: tabGISuccess ? (tabFJSuccess ? 'green' : 'red') : 'red',
                      }}
                      disabled={!tabGISuccess}
                      active={activeKey_2 === 2}
                      onClick={() => setActiveKey_2(2)}
                    >
                      FJ Information
                    </CNavLink>
                  </CNavItem>

                  {rjso_enable && (
                    <>
                      <CNavItem>
                        <CNavLink
                          style={{
                            backgroundColor: tabGISuccess
                              ? tabRJSOSuccess
                                ? 'green'
                                : 'red'
                              : 'red',
                          }}
                          disabled={!tabGISuccess}
                          active={activeKey_2 === 9}
                          onClick={() => setActiveKey_2(9)}
                          // disabled={true}
                        >
                          RJ Information
                        </CNavLink>
                      </CNavItem>
                    </>
                  )}
                  {stoTableDataFGSTO.length > 0 && (
                    <>
                      <CNavItem>
                        <CNavLink
                          style={{
                            backgroundColor: tabGISuccess ? 'green' : 'red',
                          }}
                          disabled={!tabGISuccess}
                          active={activeKey_2 === 11}
                          onClick={() => setActiveKey_2(11)}
                        >
                          SAP : FGSTO Information
                        </CNavLink>
                      </CNavItem>
                    </>
                  )}
                  {/* {((sto_enable && tripInfo.trip_sheet_info.purpose == '2') || fgstoAvailable) && ( */}
                  {(fgstoAvailable ||
                    (tripInfo && tripInfo.tripsheet_info && stoTableDataFGSTO.length == 0)) && (
                    <>
                      <CNavItem>
                        <CNavLink
                          style={{
                            backgroundColor: tabGISuccess
                              ? tabFGSTOSuccess
                                ? 'green'
                                : 'red'
                              : 'red',
                          }}
                          disabled={!tabGISuccess}
                          active={activeKey_2 === 4}
                          onClick={() => setActiveKey_2(4)}
                        >
                          FGSTO Information
                        </CNavLink>
                      </CNavItem>
                    </>
                  )}
                  {((sto_enable && tripInfo && tripInfo.tripsheet_info) || rmstoAvailable) && (
                    <>
                      <CNavItem>
                        <CNavLink
                          style={{
                            backgroundColor: tabGISuccess
                              ? tabRMSTOSuccess
                                ? 'green'
                                : 'red'
                              : 'red',
                          }}
                          disabled={!tabGISuccess}
                          active={activeKey_2 === 10}
                          onClick={() => setActiveKey_2(10)}
                        >
                          {/* RMSTO Information */}
                          RM Movement
                        </CNavLink>
                      </CNavItem>
                    </>
                  )}
                  {(othersAvailable ||
                    (tripInfo && tripInfo.tripsheet_info && stoOthersTableData.length == 0)) && (
                    <>
                      <CNavItem>
                        <CNavLink
                          style={{
                            backgroundColor: tabGISuccess
                              ? tabOthersSuccess
                                ? 'green'
                                : 'red'
                              : 'red',
                          }}
                          disabled={!tabGISuccess}
                          active={activeKey_2 === 12}
                          onClick={() => setActiveKey_2(12)}
                        >
                          Others Information
                        </CNavLink>
                      </CNavItem>
                    </>
                  )}
                  {sto_enable && tripInfo && (
                    <>
                      <CNavItem>
                        <CNavLink
                          style={{
                            backgroundColor: tabGISuccess
                              ? tabFCISuccess
                                ? 'green'
                                : 'red'
                              : 'red',
                          }}
                          disabled={!tabGISuccess}
                          active={activeKey_2 === 13}
                          onClick={() => setActiveKey_2(13)}
                        >
                          FCI Movement
                        </CNavLink>
                      </CNavItem>
                    </>
                  )}
                  {tripInfo && tripInfo.vehicle_info.vehicle_type_id == 21 && (
                    <>
                      <CNavItem>
                        <CNavLink
                          style={{
                            // backgroundColor: tabFJ_RJ_FG_RM_STO_Success
                            backgroundColor:
                              tabGISuccess &&
                              (tabFJSuccess || shipmentInfo.length === 0) &&
                              (tabRJSOSuccess || rjsoInfo.length === 0) &&
                              tabFGSTOSuccess &&
                              tabRMSTOSuccess &&
                              tabOthersSuccess &&
                              tabFCISuccess
                                ? tabDISuccess
                                  ? 'green'
                                  : 'red'
                                : 'red',
                          }}
                          disabled={
                            !(
                              tabGISuccess &&
                              (tabFJSuccess || shipmentInfo.length === 0) &&
                              (tabRJSOSuccess || rjsoInfo.length === 0) &&
                              tabFGSTOSuccess &&
                              tabRMSTOSuccess &&
                              tabOthersSuccess &&
                              tabFCISuccess
                            )
                          }
                          active={activeKey_2 === 5}
                          onClick={() => setActiveKey_2(5)}
                        >
                          Diesel Information
                        </CNavLink>
                      </CNavItem>
                    </>
                  )}
                  {/* Gate Pass Start */}
                  {/* <CNavItem>
                  <CNavLink active={activeKey_2 === 8} onClick={() => setActiveKey_2(8)}>
                    Gate Pass
                  </CNavLink>
                </CNavItem> */}
                  {/* Gate Pass End */}
                  <CNavItem></CNavItem>
                  {/* Sales Return Start */}
                  {/* <CNavItem>
                  <CNavLink active={activeKey_2 === 6} onClick={() => setActiveKey_2(6)}>
                    Return
                  </CNavLink>
                </CNavItem> */}
                  {/* Sales Return End */}
                  <CNavItem>
                    <CNavLink
                      active={activeKey_2 === 3}
                      // disabled={!tabDISuccess}
                      disabled={
                        !(
                          tabGISuccess &&
                          (tabFJSuccess || shipmentInfo.length === 0) &&
                          (tabRJSOSuccess || rjsoInfo.length === 0) &&
                          tabFGSTOSuccess &&
                          tabRMSTOSuccess &&
                          tabOthersSuccess &&
                          tabDISuccess
                        )
                      }
                      style={{
                        backgroundColor: tabDISuccess
                          ? tabEXSuccess
                            ? 'green'
                            : 'green'
                          : 'green',
                      }}
                      onClick={() => setActiveKey_2(3)}
                    >
                      Expenses
                    </CNavLink>
                  </CNavItem>
                  {/* <CNavItem>
                  <CNavLink
                    // href="javascript:void(0);"
                    active={activeKey_2 === 7}
                    onClick={() => setActiveKey_2(7)}
                  >
                    Advance
                  </CNavLink>
                </CNavItem> */}
                </CNav>
                {/*  Own / Contract Vehicles Part Header Tab End */}

                {/* Own / Contract Vehicles Part Start */}
                <CTabContent>
                  <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey_2 === 1}>
                    <CRow className="mt-2">
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="tNum1">Tripsheet Number</CFormLabel>
                        <CFormInput
                          size="sm"
                          id="tNum1"
                          value={
                            tripInfo && tripInfo.tripsheet_info
                              ? tripInfo.tripsheet_info.nlmt_tripsheet_no
                              : ''
                          }
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="vNum1">Vehicle Number</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="vNum1"
                          value={tripInfo.vehicle_info.vehicle_number}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="vCap1">Vehicle Capacity</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="vCap1"
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
                        <CFormLabel htmlFor="vType1">Vehicle Type</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="vType1"
                          //  value={tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id ? tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id : ''}
                          value={
                            VEHICLE_TYPE_MAP[
                              tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id
                                ? tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id
                                : ''
                            ] ?? '-'
                          }
                          readOnly
                        />
                      </CCol>
                      {tripInfo?.vehicle_info?.vehicle_type_id == 21 && (
                        <>
                          <CCol xs={12} md={3}>
                            <CFormLabel>Driver Name & Code</CFormLabel>
                            <CFormInput
                              size="sm"
                              value={`${tripInfo?.driver_info?.driver_name} - ${tripInfo?.driver_info?.driver_code}`}
                              //  value={tripInfo.driver_info.driver_name}
                              readOnly
                            />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel>Driver Mobile Number</CFormLabel>
                            <CFormInput
                              size="sm"
                              value={tripInfo.driver_info.driver_phone_1}
                              readOnly
                            />
                          </CCol>
                        </>
                      )}
                      {tripInfo?.vehicle_info?.vehicle_type_id == 22 && (
                        <>
                          <CCol xs={12} md={3}>
                            <CFormLabel>Driver Name </CFormLabel>
                            <CFormInput size="sm" value={tripInfo.driver_name} readOnly />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel>Driver Mobile Number</CFormLabel>
                            <CFormInput size="sm" value={tripInfo.driver_phone_1} readOnly />
                          </CCol>
                        </>
                      )}
                      {tripInfo?.vehicle_info?.vehicle_type_id == 21 && (
                        <>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="OdometerKM">Odometer Opening KM</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="OdometerKM"
                              value={tripInfo.odometer_km}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="odoImg">Odometer Opening KM</CFormLabel>

                            <div className="d-grid gap-2">
                              <CButton
                                className="text-justify"
                                color="info"
                                size="sm"
                                id="odoImg"
                                onClick={() => setOopVisible(!oopVisible)}
                              >
                                <span className="float-start">
                                  <i className="fa fa-eye"></i> &nbsp; View
                                </span>
                              </CButton>
                            </div>
                          </CCol>
                        </>
                      )}
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="inputAddress">Trip-In Date & Time</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="inputAddress"
                          value={tripInfo.gate_in_date_time_string}
                          readOnly
                        />
                      </CCol>
                      {tripInfo?.vehicle_info?.vehicle_type_id === 21 && (
                        <>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="inspectionDateTime">
                              Inspection Date Time
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              id="inspectionDateTime"
                              value={
                                tripInfo.vehicle_inspection_info
                                  ? tripInfo.vehicle_inspection_info.inspection_time_string
                                  : ''
                              }
                              readOnly
                            />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="closingKM">Closing KM</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="closingKM"
                              value={tripInfo.odometer_closing_km}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="codoKM">Odometer Closing KM</CFormLabel>

                            <div className="d-grid gap-2">
                              <CButton
                                className="text-justify"
                                color="info"
                                size="sm"
                                id="codoKM"
                                onClick={() => setCopVisible(!copVisible)}
                              >
                                <span className="float-start">
                                  <i className="fa fa-eye"></i> &nbsp; View
                                </span>
                              </CButton>
                            </div>
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="tripKM">Trip KM</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="tripKM"
                              value={tripKMFinder(
                                tripInfo.odometer_km,
                                tripInfo.odometer_closing_km
                              )}
                              readOnly
                            />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="budgetKM">
                              Budgeted KM <REQ />
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="budgetKM"
                              onChange={(e) => (e.target.validity.valid ? onChangeItem(e) : '')}
                              name="budgetKM"
                              pattern="[0-9]*"
                              maxLength={7}
                              value={calculationValues.budgetKM || ''}
                            />
                          </CCol>
                          {/* <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="actualKM">Actual KM</CFormLabel>

                      <CFormInput
                        size="sm"
                        id="actualKM"
                        onChange={(e) => (e.target.validity.valid ? onChangeItem(e) : '')}
                        name="actualKM"
                        pattern="[0-9]*"
                        maxLength={7}
                        value={calculationValues.actualKM || ''}
                      />
                    </CCol> */}
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="diffKM">Diff. KM</CFormLabel>

                            <CFormInput size="sm" id="diffKM" value={differenceKMFinder} readOnly />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="tripIdleHours">
                              Idle Hrs <REQ />
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              id="tripIdleHours"
                              onChange={(e) => (e.target.validity.valid ? onChangeIdleHrs(e) : '')}
                              name="tripIdleHours"
                              pattern="[0-9]*"
                              maxLength={3}
                              value={tripIdleHours}
                            />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="budgetMileage">
                              Budgeted Mileage <REQ />
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="budgetMileage"
                              onChange={(e) => onChangeItem(e)}
                              name="budgetMileage"
                              maxLength={4}
                              value={calculationValues.budgetMileage || ''}
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="actualMileage">
                              Actual Mileage <REQ />
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="actualMileage"
                              onChange={(e) => onChangeItem(e)}
                              name="actualMileage"
                              maxLength={4}
                              value={calculationValues.actualMileage || ''}
                            />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="diffmil">Diff. Mileage</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="diffmil"
                              value={differenceMileageFinder}
                              readOnly
                            />
                          </CCol>
                        </>
                      )}
                      {/* <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="diffmil">Trip Purpose</CFormLabel>

                        <CFormInput size="sm" id="diffmil" value={tripInfo && tripInfo.trip_sheet_info ? tripPurposeFinder(tripInfo.trip_sheet_info.purpose) : ''} readOnly />
                      </CCol> */}
                      {/* {((sto_enable && tripInfo.trip_sheet_info.purpose != '2') || !sto_enable) && ( */}
                      {tripInfo && tripInfo.tripsheet_info && !(stoTableDataFGSTO.length == 0) && (
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="fgsto_trip_addon_availability">
                            FG-STO Availability
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            onChange={(e) => {
                              fgstoaddonTabEnableCheck(e)
                            }}
                            name="fgsto_trip_addon_availability"
                            value={fgsto_tripAddonAvailability}
                            id="fgsto_trip_addon_availability"
                          >
                            {/* <option value="">Select...</option> */}
                            <option value="1">Yes</option>
                            <option value="2" selected>
                              No
                            </option>
                          </CFormSelect>
                        </CCol>
                      )}
                      {tripInfo && tripInfo.tripsheet_info && (
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="others_trip_addon_availability">
                            Others Availability
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            onChange={(e) => {
                              othersaddonTabEnableCheck(e)
                            }}
                            name="others_trip_addon_availability"
                            value={others_tripAddonAvailability}
                            id="others_trip_addon_availability"
                          >
                            {/* <option value="">Select...</option> */}
                            <option value="1">Yes</option>
                            <option value="2" selected>
                              No
                            </option>
                          </CFormSelect>
                        </CCol>
                      )}
                      {/* {((sto_enable && tripInfo.trip_sheet_info.purpose != '3') || !sto_enable) && (
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="rmsto_trip_addon_availability">
                          RM-STO Addon Availability
                        </CFormLabel>
                        <CFormSelect
                          size="sm"
                          onChange={(e) => {
                            rmstoaddonTabEnableCheck(e)
                          }}
                          name="rmsto_trip_addon_availability"
                          value={rmsto_tripAddonAvailability}
                          id="rmsto_trip_addon_availability"
                        >
                          {/* <option value="">Select...</option> */}
                      {/* <option value="1">Yes</option>
                          <option value="2" selected>
                            No
                          </option>
                        </CFormSelect>
                      </CCol>
                    )}   */}
                    </CRow>

                    {/* <CRow className="">
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="inputAddress">Total Diesel Consume</CFormLabel>

                    <CFormInput size="sm" id="inputAddress" value="2" readOnly />
                  </CCol>
                </CRow> */}
                    {tripInfo && tripInfo?.vehicle_info?.vehicle_type_id == 24 && (
                      <>
                        <CRow key={`HireshipmentData1`} className="mt-2" hidden>
                          <CCol xs={12} md={3}>
                            <CFormLabel
                              htmlFor="inputAddress"
                              style={{
                                backgroundColor: '#4d3227',
                                color: 'white',
                              }}
                            >
                              Vehicle Request Details
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        <ColoredLine color="red" />
                        {!smallFetch && <SmallLoader />}
                        {smallFetch &&
                          vehicleRequestsData.map((currentVrData, kk) => {
                            return (
                              <>
                                <CRow>
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="tNum">{kk + 1} ) VR No</CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      id="tNum"
                                      value={currentVrData.vr_no}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="tNum">Division</CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      id="tNum"
                                      value={div_finder(currentVrData.vr_division)}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="tNum">Department</CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      id="tNum"
                                      value={dep_finder(currentVrData.vr_dept)}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="tNum">Product</CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      id="tNum"
                                      value={prod_finder(currentVrData.vr_prod)}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="tNum">From Location</CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      id="tNum"
                                      value={currentVrData.vr_from_loc}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="tNum">To Location</CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      id="tNum"
                                      value={currentVrData.vr_to_loc}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="tNum">Request By</CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      id="tNum"
                                      value={`${currentVrData.request_by} (${currentVrData.contact_no})`}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="tNum">Vehicle Capacity</CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      id="tNum"
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
                                    <CFormLabel htmlFor="tNum">
                                      Vehicle Body Type / Variety
                                    </CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      id="tNum"
                                      value={`${veh_body_finder(currentVrData.vr_body_id)} / ${
                                        veh_variety_finder(currentVrData.vr_variety_id) || '-'
                                      }`}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="tNum">Remarks</CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      id="tNum"
                                      value={currentVrData.veh_remarks}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="tNum">Expected Date</CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      id="tNum"
                                      value={currentVrData.require_time_date_string}
                                      readOnly
                                    />
                                  </CCol>
                                </CRow>
                                <ColoredLine color="red" />
                              </>
                            )
                          })}
                      </>
                    )}
                  </CTabPane>

                  {/* Own/Contract Vehicle FG-SALES Part Start */}
                  {tabGISuccess && (
                    <CTabPane
                      role="tabpanel"
                      aria-labelledby="profile-tab"
                      visible={activeKey_2 === 2}
                    >
                      {shipmentInfo.map((data, index) => {
                        return (
                          <>
                            <CRow key={`OwnContractshipmentData${index}`} className="mt-2" hidden>
                              <CCol xs={12} md={3}>
                                <CFormLabel
                                  htmlFor="inputAddress"
                                  style={{
                                    backgroundColor: '#4d3227',
                                    color: 'white',
                                  }}
                                >
                                  Shipment Number : {data.shipment_no}
                                </CFormLabel>
                              </CCol>
                            </CRow>
                            {data.shipment_child_info.map((val, val_index) => {
                              return (
                                <>
                                  <CRow key={`OwnContractChildData_${index}_${val_index}`}>
                                    <CCol xs={12} md={2}>
                                      <CFormLabel htmlFor="sNum">Delivery Number</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        id="sNum"
                                        value={val.delivery_no}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol xs={12} md={2}>
                                      <CFormLabel htmlFor="sNum">
                                        Delivery Quantity in MTS
                                      </CFormLabel>

                                      <CFormInput
                                        size="sm"
                                        id="sNum"
                                        value={val.delivery_net_qty}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol xs={12} md={2}>
                                      <CFormLabel htmlFor="sInvoice">Invoice Number</CFormLabel>

                                      <CFormInput
                                        size="sm"
                                        id="sInvoice"
                                        value={val.invoice_no}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol xs={12} md={2}>
                                      <CFormLabel htmlFor="sNum">Invoice Quantity</CFormLabel>

                                      <CFormInput
                                        size="sm"
                                        id="sNum"
                                        value={`${val.invoice_net_quantity} - ${val.invoice_uom}`}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol xs={12} md={2}>
                                      <CFormLabel htmlFor="sNum">
                                        Billed Shipment Quantity in MTS
                                      </CFormLabel>

                                      <CFormInput
                                        size="sm"
                                        id="sNum"
                                        value={`${data.billed_net_qty}`}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol xs={12} md={2}>
                                      <CFormLabel htmlFor="cNum">Customer Name</CFormLabel>

                                      <CFormInput
                                        size="sm"
                                        id="cNum"
                                        value={val.customer_info.CustomerName}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol xs={12} md={2}>
                                      <CFormLabel htmlFor="cNum">Customer Code</CFormLabel>

                                      <CFormInput
                                        size="sm"
                                        id="cNum"
                                        value={val.customer_info.CustomerCode}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol xs={12} md={2}>
                                      <CFormLabel htmlFor="cNum">Customer City</CFormLabel>

                                      <CFormInput
                                        size="sm"
                                        id="cNum"
                                        value={val.customer_info.CustomerCity}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol xs={12} md={2}>
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
                                    {/* <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="sDelivery">
                                      Delivery Date & Time
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="datetime-local"
                                      onChange={(e) => {
                                        changeVadTableItem(
                                          e,
                                          'delivered_date_time',
                                          index,
                                          val_index
                                        )
                                      }}
                                      value={vadDataUpdate(
                                        val.delivered_date_time,
                                        val.delivered_date_time_input
                                      )}
                                    />
                                    {val.delivered_date_time_validated === false && (
                                      <span className="small text-danger">
                                        Date & Time Should be Filled
                                      </span>
                                    )}
                                  </CCol> */}
                                    {/* <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="unload2">Unloading Charges</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="text"
                                      onChange={(e) => {
                                        changeVadTableItem(e, 'unloading_charges', index, val_index)
                                      }}
                                      value={vadDataUpdate(
                                        val.unloading_charges,
                                        val.unloading_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                    {val.unloading_charges_validated === false && (
                                      <span className="small text-danger">
                                        Unloading Charges Should be Filled
                                      </span>
                                    )}
                                        </CCol> */}
                                    {/* <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="fjPod">FJ POD Copy</CFormLabel>
                                    <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                                        {//console.log(shipmentInfo,'shipmentInfo-FGSALES')}
                                        { !shipmentInfo[index].shipment_child_info[val_index].fj_pod_copy ? (
                                          <>
                                            <span
                                              className="float-start"
                                              onClick={() => {
                                                uploadClickFJ(index,val_index)
                                              }}
                                            >
                                              <CIcon
                                                style={{color:'red'}}
                                                icon={icon.cilFolderOpen}
                                                size="lg"
                                              />
                                              &nbsp;Upload
                                            </span>
                                            <span
                                              style={{marginRight:'10%'}}
                                              className="mr-10 float-end"
                                              onClick={() => {
                                                setFileImageKey(index+'|'+val_index)
                                                setCamEnableType("fjsales")
                                                setCamEnable(true)
                                              }}
                                            >
                                              <CIcon
                                                  style={{color:'red'}}
                                                  icon={icon.cilCamera}
                                                  size="lg"
                                                />
                                              &nbsp;Camera
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <span className="float-start">
                                              &nbsp;{shipmentInfo[index].shipment_child_info[val_index].fj_pod_copy_file_name}
                                            </span>
                                            <span className="float-end">
                                              <i
                                                className="fa fa-trash"
                                                aria-hidden="true"
                                                onClick={() => {
                                                  clearValues(val_index,'fjsales',index)

                                                }}
                                              ></i>
                                            </span>
                                          </>
                                        )}
                                      </CButton>
                                    <CFormInput
                                      onBlur={onBlur}
                                      onChange={(e) => changeVadTableItem(e, 'fj_pod_copy', index, val_index)}
                                      type="file"
                                      accept=".jpg,.jpeg,.png,.pdf"
                                      name={'fj_pod_copy'}
                                      size="sm"
                                      id={`fj_pod_copy_upload_yes_parent${index}_child${val_index}`}
                                      style={{display:'none'}}
                                    />
                                  </CCol> */}
                                    <CCol md={2}>
                                      <CFormLabel htmlFor="DefectType">Defect Type</CFormLabel>

                                      <CFormSelect
                                        size="sm"
                                        onChange={(e) => {
                                          changeVadTableItem(e, 'defect_type', index, val_index)
                                        }}
                                        value={vadDataUpdate(
                                          val.defect_type,
                                          val.defect_type_input
                                        )}
                                      >
                                        <option value="">Select...</option>
                                        <option value="1">Shortage</option>
                                        <option value="2">Rain Damage</option>
                                        <option value="3">Sales Diversion</option>
                                        <option value="4">Sales Return</option>
                                        <option value="4">Halting</option>
                                      </CFormSelect>
                                    </CCol>
                                  </CRow>
                                </>
                              )
                            })}
                            <hr />
                          </>
                        )
                      })}
                    </CTabPane>
                  )}
                  {/* Own/Contract Vehicle FG-SALES Part End */}
                  {/* Own/Contract Vehicle RJSO Part Start */}
                  {tabGISuccess && (
                    <CTabPane
                      role="tabpanel"
                      aria-labelledby="profile-tab"
                      visible={activeKey_2 === 9}
                    >
                      {rjsoInfo.map((data, index) => {
                        return (
                          <>
                            <CRow key={`RJSOInfoData${index}`} className="mt-3" hidden>
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="rNum">RJ SO Number</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="rNum"
                                  // value={tripInfo.rj_so_info ? tripInfo.rj_so_info.rj_so_no : ''}
                                  value={data.rj_so_no}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="rCustomer">Customer Name</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="rCustomer"
                                  // value={tripInfo.rj_so_info ? tripInfo.rj_so_info.customer_code : ''}
                                  // value={data.customer_code}
                                  value={
                                    data.customer_code
                                      ? rjcustomerCodeToname(data.customer_code) +
                                        ' - (' +
                                        data.customer_code +
                                        ')'
                                      : 'Loading..'
                                  }
                                  readOnly
                                />
                              </CCol>

                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="rDelivery">Delivered Date & Time</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  type="datetime-local"
                                  onChange={(e) => {
                                    changeRjsoTableItem(e, 'actual_delivery_date_time', index)
                                  }}
                                  value={rjsoDataUpdate(
                                    data.actual_delivery_date_time,
                                    data.actual_delivery_date_time_input
                                  )}
                                />
                                {data.actual_delivery_date_time_validated === false && (
                                  <span className="small text-danger">
                                    Date & Time Should be Filled
                                  </span>
                                )}
                              </CCol>
                              {/* <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="rUnload">Unloading Charges</CFormLabel>

                              <CFormInput
                                size="sm"
                                type="text"
                                onChange={(e) => {
                                  changeRjsoTableItem(e, 'unloading_charges', index)
                                }}
                                value={rjsoDataUpdate(
                                  data.unloading_charges,
                                  data.unloading_charges_input
                                )}
                                maxLength={5}
                              />
                              {data.unloading_charges_validated === false && (
                                <span className="small text-danger">
                                  Unloading Charges Should be Filled
                                </span>
                              )}
                            </CCol> */}

                              {/* Own Vehicle RJ Shed Copy - OVRJPC */}
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="rPOD">RJ Shed Copy</CFormLabel>
                                <div className="d-grid gap-2">
                                  <CButton
                                    className="text-justify"
                                    color="info"
                                    size="sm"
                                    id="odoImg"
                                  >
                                    <CNavLink
                                      style={{ color: 'blue' }}
                                      href={`${data.rj_shed_copy}`}
                                      target={'_blank'}
                                    >
                                      <i style={{ marginRight: '5px' }} className="fa fa-eye"></i>
                                      View
                                    </CNavLink>
                                  </CButton>
                                </div>
                              </CCol>
                              {/* Own Vehicle RJ POD Copy - OVRJPC */}
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="fjPod">RJ POD Copy</CFormLabel>
                                <CButton
                                  className="w-100 m-0"
                                  color="info"
                                  size="sm"
                                  id="inputAddress"
                                >
                                  {console.log(rjsoInfo, 'rjsoInfo-RJSO')}
                                  {!rjsoInfo[index].rj_pod_copy ? (
                                    <>
                                      <span
                                        className="float-start"
                                        onClick={() => {
                                          uploadClickRJ(index)
                                        }}
                                      >
                                        <CIcon
                                          style={{ color: 'red' }}
                                          icon={icon.cilFolderOpen}
                                          size="lg"
                                        />
                                        &nbsp;Upload
                                      </span>
                                      <span
                                        style={{ marginRight: '10%' }}
                                        className="mr-10 float-end"
                                        onClick={() => {
                                          setFileImageKey(index)
                                          setCamEnableType('rjso')
                                          setCamEnable(true)
                                        }}
                                      >
                                        <CIcon
                                          style={{ color: 'red' }}
                                          icon={icon.cilCamera}
                                          size="lg"
                                        />
                                        &nbsp;Camera
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="float-start">
                                        &nbsp;{rjsoInfo[index].rj_pod_copy_file_name}
                                      </span>
                                      <span className="float-end">
                                        <i
                                          className="fa fa-trash"
                                          aria-hidden="true"
                                          onClick={() => {
                                            clearValues(index, 'rjso')
                                          }}
                                        ></i>
                                      </span>
                                    </>
                                  )}
                                </CButton>
                                <CFormInput
                                  onBlur={onBlur}
                                  onChange={(e) => {
                                    changeRjsoTableItem(e, 'rj_pod_copy', index)
                                  }}
                                  // onChange={(e) => changeVadTableItem(e, 'fj_pod_copy', index, val_index)}
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.pdf"
                                  name={'rj_pod_copy'}
                                  size="sm"
                                  id={`rj_pod_copy_upload_yes_${index}`}
                                  style={{ display: 'none' }}
                                />
                              </CCol>
                              <CCol md={2}>
                                <CFormLabel htmlFor="DefectType">Defect Type</CFormLabel>

                                <CFormSelect
                                  size="sm"
                                  onChange={(e) => {
                                    changeRjsoTableItem(e, 'defect_type', index)
                                  }}
                                  value={rjsoDataUpdate(data.defect_type, data.defect_type_input)}
                                >
                                  <option value="">Select Types</option>

                                  <option value="1">Unloading Charges</option>

                                  <option value="2">Subdelivery Charges</option>

                                  <option value="3">Halting Charges</option>

                                  <option value="4">Low Tonage</option>
                                </CFormSelect>
                              </CCol>
                            </CRow>
                          </>
                        )
                      })}
                    </CTabPane>
                  )}
                  {/* Own/Contract Vehicle RJSO Part End */}
                  {/* Own Vehicle FG-STO Info Tab START */}
                  {tabGISuccess && (
                    <CTabPane
                      role="tabpanel"
                      aria-labelledby="contact-tab"
                      visible={activeKey_2 === 4}
                    >
                      <div className="App">
                        <div>
                          <CRow className="mt-2">
                            <CCol md={2}>
                              <CFormLabel>
                                STO Delivery Number <REQ />
                              </CFormLabel>
                              <CInputGroup>
                                {!stoDeliveryEdit && (
                                  <>
                                    <CFormInput
                                      size="sm"
                                      value={stoValues.sto_delivery_number}
                                      onChange={(e) => handleStoValueChange(e)}
                                      name="sto_delivery_number"
                                      maxLength={10}
                                    />
                                    <CInputGroupText className="p-0">
                                      <CButton
                                        size="sm"
                                        color="success"
                                        onClick={(e) => getStoDeliveryData(e)}
                                      >
                                        <i className="fa fa-check px-1"></i>
                                      </CButton>
                                    </CInputGroupText>
                                  </>
                                )}
                                {stoDeliveryEdit && (
                                  <CFormInput
                                    size="sm"
                                    value={
                                      stoValues.sto_delivery_number
                                        ? stoValues.sto_delivery_number
                                        : stoDeliveryEdit
                                        ? stoValues.sto_delivery_no
                                        : ''
                                    }
                                    // value={stoValues.sto_delivery_number || stoValues.sto_delivery_no}
                                    id="sto_delivery_number"
                                    readOnly
                                  />
                                )}
                              </CInputGroup>
                            </CCol>

                            <CCol md={2}>
                              <CFormLabel>STO PO Number</CFormLabel>
                              <CFormInput
                                size="sm"
                                value={
                                  stoValues.sto_po_number
                                    ? stoValues.sto_po_number
                                    : stoDeliveryEdit
                                    ? stoValues.sto_po_no
                                    : ''
                                }
                                // value={
                                //   stoValues.sto_po_number || stoDeliveryEdit
                                //     ? stoValues.sto_po_no
                                //     : ''
                                // }
                                id="sto_po_number"
                                readOnly
                              />
                            </CCol>
                            <CCol md={2}>
                              <CFormLabel>Division</CFormLabel>
                              <CFormInput
                                size="sm"
                                value={stoValues.sto_delivery_division}
                                // onChange={(e) => handleStoValueChange(e)}
                                name={sto_delivery_division}
                                maxLength={1}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel>From Location</CFormLabel>

                              <CFormInput
                                size="sm"
                                value={
                                  stoValues.sto_from_location
                                    ? location_name(stoValues.sto_from_location)
                                    : stoDeliveryEdit
                                    ? location_name(stoValues.from_location)
                                    : ''
                                }
                                // value={
                                //   stoValues.sto_from_location || stoDeliveryEdit
                                //     ? stoValues.from_location
                                //     : ''
                                // }
                                // onChange={(e) => handleStoValueChange(e)}
                                name={sto_from_location}
                                maxLength={30}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel>To Location</CFormLabel>

                              <CFormInput
                                size="sm"
                                value={
                                  stoValues.sto_to_location
                                    ? location_name(stoValues.sto_to_location)
                                    : stoDeliveryEdit
                                    ? location_name(stoValues.to_location)
                                    : ''
                                }
                                // value={
                                //   stoValues.sto_to_location || stoDeliveryEdit
                                //     ? stoValues.to_location
                                //     : ''
                                // }
                                // onChange={(e) => handleStoValueChange(e)}
                                name={sto_to_location}
                                maxLength={30}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel>Delivery Qty in MTS</CFormLabel>

                              <CFormInput
                                size="sm"
                                // type="number"
                                value={
                                  stoValues.sto_delivery_quantity
                                    ? stoValues.sto_delivery_quantity
                                    : stoDeliveryEdit
                                    ? stoValues.sto_delivery_quantity
                                    : ''
                                }
                                // value={stoValues.sto_delivery_quantity}
                                // onChange={(e) => handleStoValueChange(e)}
                                name={sto_delivery_quantity}
                                maxLength={5}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel>Freight Amount</CFormLabel>

                              <CFormInput
                                size="sm"
                                value={
                                  stoValues.sto_freight_amount
                                    ? stoValues.sto_freight_amount
                                    : stoDeliveryEdit
                                    ? stoValues.freight_amount
                                    : ''
                                }
                                // value={
                                //   stoValues.sto_freight_amount || stoDeliveryEdit
                                //     ? stoValues.freight_amount
                                //     : ''
                                // }
                                // onChange={(e) => handleStoValueChange(e)}
                                name={sto_freight_amount}
                                maxLength={6}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel>Delivery Date and Time</CFormLabel>

                              <CFormInput
                                size="sm"
                                type="datetime-local"
                                value={
                                  stoValues.sto_delivery_date_time
                                    ? stoValues.sto_delivery_date_time
                                    : stoDeliveryEdit
                                    ? stoValues.delivered_date_time
                                    : ''
                                }
                                // value={
                                //   stoValues.sto_delivery_date_time || stoDeliveryEdit
                                //     ? stoValues.delivered_date_time
                                //     : ''
                                // }
                                onChange={(e) => handleStoValueChange(e)}
                                name={sto_delivery_date_time}
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel>POD Copy</CFormLabel>
                              {stoFileUploadVisible ? (
                                <CFormInput
                                  type="file"
                                  size="sm"
                                  value={stoValues.sto_pod_copy}
                                  // onChange={(e) => handleStoValueChange(e)}
                                  onChange={(e) => handleStoFileUploadChange(e)}
                                  name={sto_pod_copy}
                                />
                              ) : (
                                <CButton className="w-100 m-0" color="info" size="sm" id="dInvoice">
                                  <span
                                    className="float-start"
                                    onClick={() => setStoPodVisible(true)}
                                  >
                                    <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                                  </span>
                                  <span
                                    className="float-end"
                                    onClick={() => {
                                      if (window.confirm('Are you sure to remove this file?')) {
                                        stoPodUploadResetEdit()
                                      }
                                    }}
                                  >
                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                  </span>
                                </CButton>
                              )}
                            </CCol>
                            {/* {stoValues.sto_pod_copy && <img src={filePath} />} */}
                            {/* <CCol md={2}>
                            <CFormLabel>
                              Driver Name <REQ />{' '}
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              value={
                                stoValues.sto_delivery_driver_name
                                  ? stoValues.sto_delivery_driver_name
                                  : stoDeliveryEdit
                                  ? stoValues.driver_name
                                  : ''
                              }
                              // value={
                              //   stoValues.sto_delivery_driver_name || stoDeliveryEdit
                              //     ? stoValues.driver_name
                              //     : ''
                              // }
                              onChange={(e) => handleStoValueChange(e)}
                              name={sto_delivery_driver_name}
                            >
                              {/* <AllDriverListSelectComponent /> */}
                            {/* <AllDriverListNameSelectComponent />
                            </CFormSelect>{' '}
                          </CCol>   */}
                            {/* <CCol xs={12} md={2}>
                            <CFormLabel>Expense To Be Capture</CFormLabel>

                            <CTableDataCell scope="row">
                              <input
                                className="form-check-input"
                                style={{ minHeight: '18px !important' }}
                                type="checkbox"
                                // defaultChecked={false}
                                checked={stoValues.sto_delivery_expense_capture}
                                // type="checkbox"
                                value={stoValues.sto_delivery_expense_capture}
                                // onChange={(e) => handleStoValueChange(e)}
                                onChange={(e) => handleStoExpenseCaptureChange(e)}
                                name={sto_delivery_expense_capture}
                              />
                            </CTableDataCell>
                          </CCol> */}

                            <CCol xs={12} md={2}>
                              {' '}
                            </CCol>
                            <CCol xs={12} md={2}>
                              {' '}
                            </CCol>
                            <CCol xs={12} md={2}>
                              {' '}
                            </CCol>
                          </CRow>
                        </div>
                      </div>

                      <div
                        className="App"
                        style={{ display: 'flex', flexDirection: 'row-reverse' }}
                      >
                        <CButton
                          className="m-2"
                          disabled={!isStoEditMode && stoDeliveryInvalid ? true : false}
                          onClick={onStoSubmitBtn}
                          color="primary"
                        >
                          {isStoEditMode ? 'Update' : 'Add'}
                        </CButton>{' '}
                        <CButton className="m-2" onClick={onStoSubmitCancelBtn} color="primary">
                          Clear
                        </CButton>
                        {isStoEditMode && (
                          <CButton className="m-2" onClick={stoResetEdit} color="primary">
                            Cancel Edit
                          </CButton>
                        )}
                        <br />
                      </div>
                      <hr />
                      <StoTableComponent
                        stoTableData={stoTableData}
                        title="STO Information Table"
                        onEdit={onStoEditcallback}
                        onDelete={onStoDeleteCallback}
                        isStoEditMode={isStoEditMode}
                        hireVehicle={
                          tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id &&
                          tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id == 22
                            ? true
                            : false
                        }
                      />
                    </CTabPane>
                  )}
                  {/* Own Vehicle FG-STO Info Tab END================================== */}
                  {/* Own Vehicle SAP : FG-STO Info Tab START================================= */}
                  <CTabPane
                    role="tabpanel"
                    aria-labelledby="contact-tab"
                    visible={activeKey_2 === 11}
                  >
                    <div className="App">
                      <div>
                        {stoTableDataFGSTO.map((data_val, index_val) => {
                          //console.log(data_val, 'data_val-stoTableDataFGSTO.map own')
                          return (
                            <>
                              <CRow className="mt-2" key={`fgsto_data_${index_val}`}>
                                <CCol md={2}>
                                  <CFormLabel>STO Delivery Number</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data_val.sto_delivery_number_fgsto}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>STO PO Number</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data_val.sto_po_number_fgsto}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>Division</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data_val.sto_delivery_division_fgsto}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>From Location</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data_val.sto_from_location_fgsto}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>To Location</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data_val.sto_to_location_fgsto}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>Delivery Qty in MTS</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data_val.sto_delivery_quantity_fgsto}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>Freight Amount</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data_val.sto_freight_amount_fgsto}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel>Delivery Date and Time</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type="datetime-local"
                                    name="sto_delivery_date_time_fgsto"
                                    // value={stoValuesRMSTO[index_val].sto_delivery_date_time_rmsto}
                                    onChange={(e) => handleStoValueChangeFGSTO(e, index_val)}
                                  />
                                </CCol>
                                {stoValuesFGSTO && stoValuesFGSTO.length > 0 && (
                                  <CCol xs={12} md={2}>
                                    <CFormLabel>POD Copy</CFormLabel>{' '}
                                    {/* Own Vehicle FGSTO POD Copy - OVRPC */}
                                    <CButton
                                      className="w-100 m-0"
                                      color="info"
                                      size="sm"
                                      id="inputAddress"
                                    >
                                      {console.log(
                                        stoValuesRMSTO,
                                        'stoValuesRMSTO - Own Vehicle FGSTO POD Copy - OVRPC'
                                      )}
                                      {!(
                                        stoValuesFGSTO[index_val] &&
                                        stoValuesFGSTO[index_val].sto_pod_copy_fgsto_file_upload
                                      ) ? (
                                        <>
                                          <span
                                            className="float-start"
                                            onClick={() => {
                                              uploadClick(index_val)
                                            }}
                                          >
                                            <CIcon
                                              style={{ color: 'red' }}
                                              icon={icon.cilFolderOpen}
                                              size="lg"
                                            />
                                            &nbsp;Upload
                                          </span>
                                          <span
                                            style={{ marginRight: '10%' }}
                                            className="mr-10 float-end"
                                            onClick={() => {
                                              setFileImageKey(index_val)
                                              setCamEnableType('fgsto')
                                              setCamEnable(true)
                                            }}
                                          >
                                            <CIcon
                                              style={{ color: 'red' }}
                                              icon={icon.cilCamera}
                                              size="lg"
                                            />
                                            &nbsp;Camera
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <span className="float-start">
                                            &nbsp;
                                            {stoValuesFGSTO[index_val]
                                              ? stoValuesFGSTO[index_val]
                                                  .sto_pod_copy_fgsto_file_name
                                              : ''}
                                          </span>
                                          <span className="float-end">
                                            <i
                                              className="fa fa-trash"
                                              aria-hidden="true"
                                              onClick={() => {
                                                clearValues(index_val, 'fgsto')
                                              }}
                                            ></i>
                                          </span>
                                        </>
                                      )}
                                    </CButton>
                                    <CFormInput
                                      onBlur={onBlur}
                                      onChange={(e) => handleStoFileUploadChangeFGSTO(e, index_val)}
                                      type="file"
                                      accept=".jpg,.jpeg,.png,.pdf"
                                      name={'sto_pod_copy_fgsto'}
                                      size="sm"
                                      id={`sto_pod_copy_fgsto_upload_yes_${index_val}`}
                                      style={{ display: 'none' }}
                                    />
                                  </CCol>
                                )}

                                {/* Without Camera : Own Vehicle RMSTO POD Copy - OVRPC */}
                                {/* <CCol xs={12} md={2} style={{display:'none'}}>
                                <CFormLabel>POD Copy</CFormLabel>
                                <CFormInput
                                  type="file"
                                  size="sm"
                                  accept=".jpg,.jpeg,.png,.pdf"
                                  name="sto_pod_copy_rmsto"
                                  onChange={(e) => handleStoFileUploadChangeRMSTO(e, index_val)}
                                />
                              </CCol> */}
                              </CRow>
                              <hr />
                            </>
                          )
                        })}
                      </div>
                    </div>
                  </CTabPane>
                  {/* Own Vehicle SAP : FGSTO Info Tab END====================================== */}
                  {/* Own Vehicle RMSTO Info Tab START================================= */}
                  {tabGISuccess && (
                    <CTabPane
                      role="tabpanel"
                      aria-labelledby="contact-tab"
                      visible={activeKey_2 === 10}
                    >
                      <div className="App">
                        <div>
                          {stoTableDataRMSTO.length == 0 && (
                            <>
                              <div className="m-5">
                                <h2>There are no delivery records to display..</h2>
                              </div>
                            </>
                          )}
                          {RmstoInfoAvailable(stoTableDataRMSTO) && (
                            <CRow className="mt-2" hidden>
                              <CCol xs={12} md={3}>
                                <CFormLabel
                                  htmlFor="inputAddress"
                                  style={{
                                    backgroundColor: '#4d3227',
                                    color: 'white',
                                  }}
                                >
                                  RMSTO Information
                                </CFormLabel>
                              </CCol>
                            </CRow>
                          )}
                          {stoTableDataRMSTO.map((data_val, index_val) => {
                            //console.log(data_val, 'data_val-stoTableDataRMSTO.map own')
                            if (data_val.sto_delivery_number_rmsto != '') {
                              return (
                                <>
                                  <CRow className="mt-2" key={`rmsto_data_${index_val}`}>
                                    <CCol md={2}>
                                      <CFormLabel>STO Delivery Number</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_delivery_number_rmsto}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol md={2}>
                                      <CFormLabel>STO PO Number</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_po_number_rmsto}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol md={2}>
                                      <CFormLabel>Division</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_delivery_division_rmsto}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol md={2}>
                                      <CFormLabel>From Location</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_from_location_rmsto}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol md={2}>
                                      <CFormLabel>To Location</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_to_location_rmsto}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol md={2}>
                                      <CFormLabel>Driver Name</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_driver_name_rmsto}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol md={2}>
                                      <CFormLabel>Delivery Qty in MTS</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_delivery_quantity_rmsto}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol md={2}>
                                      <CFormLabel>Freight Amount</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_freight_amount_rmsto}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol xs={12} md={2}>
                                      <CFormLabel>Delivery Date and Time</CFormLabel>

                                      <CFormInput
                                        size="sm"
                                        type="datetime-local"
                                        name="sto_delivery_date_time_rmsto"
                                        // value={stoValuesRMSTO[index_val].sto_delivery_date_time_rmsto}
                                        onChange={(e) => handleStoValueChangeRMSTO(e, index_val)}
                                      />
                                    </CCol>
                                    {stoValuesRMSTO && stoValuesRMSTO.length > 0 && (
                                      <CCol xs={12} md={2}>
                                        <CFormLabel>POD Copy</CFormLabel>{' '}
                                        {/* Own Vehicle RMSTO POD Copy - OVRPC */}
                                        <CButton
                                          className="w-100 m-0"
                                          color="info"
                                          size="sm"
                                          id="inputAddress"
                                        >
                                          {console.log(
                                            stoValuesRMSTO,
                                            'stoValuesRMSTO - Own Vehicle RMSTO POD Copy - OVRPC'
                                          )}
                                          {!(
                                            stoValuesRMSTO[index_val] &&
                                            stoValuesRMSTO[index_val].sto_pod_copy_rmsto_file_upload
                                          ) ? (
                                            <>
                                              <span
                                                className="float-start"
                                                onClick={() => {
                                                  uploadClick(index_val)
                                                }}
                                              >
                                                <CIcon
                                                  style={{ color: 'red' }}
                                                  icon={icon.cilFolderOpen}
                                                  size="lg"
                                                />
                                                &nbsp;Upload
                                              </span>
                                              <span
                                                style={{ marginRight: '10%' }}
                                                className="mr-10 float-end"
                                                onClick={() => {
                                                  setFileImageKey(index_val)
                                                  setCamEnableType('rmsto')
                                                  setCamEnable(true)
                                                }}
                                              >
                                                <CIcon
                                                  style={{ color: 'red' }}
                                                  icon={icon.cilCamera}
                                                  size="lg"
                                                />
                                                &nbsp;Camera
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <span className="float-start">
                                                &nbsp;
                                                {stoValuesRMSTO[index_val]
                                                  ? stoValuesRMSTO[index_val]
                                                      .sto_pod_copy_rmsto_file_name
                                                  : ''}
                                              </span>
                                              <span className="float-end">
                                                <i
                                                  className="fa fa-trash"
                                                  aria-hidden="true"
                                                  onClick={() => {
                                                    clearValues(index_val, 'rmsto')
                                                  }}
                                                ></i>
                                              </span>
                                            </>
                                          )}
                                        </CButton>
                                        <CFormInput
                                          onBlur={onBlur}
                                          onChange={(e) =>
                                            handleStoFileUploadChangeRMSTO(e, index_val)
                                          }
                                          type="file"
                                          accept=".jpg,.jpeg,.png,.pdf"
                                          name={'sto_pod_copy_rmsto'}
                                          size="sm"
                                          id={`sto_pod_copy_rmsto_upload_yes_${index_val}`}
                                          style={{ display: 'none' }}
                                        />
                                      </CCol>
                                    )}

                                    {/* Without Camera : Own Vehicle RMSTO POD Copy - OVRPC */}
                                    {/* <CCol xs={12} md={2} style={{display:'none'}}>
                                          <CFormLabel>POD Copy</CFormLabel>
                                          <CFormInput
                                            type="file"
                                            size="sm"
                                            accept=".jpg,.jpeg,.png,.pdf"
                                            name="sto_pod_copy_rmsto"
                                            onChange={(e) => handleStoFileUploadChangeRMSTO(e, index_val)}
                                          />
                                        </CCol> */}
                                  </CRow>
                                  <hr />
                                </>
                              )
                            }
                          })}
                          {RakeInfoAvailable(stoTableDataRMSTO) && (
                            <CRow className="mt-2" hidden>
                              <CCol xs={12} md={3}>
                                <CFormLabel
                                  htmlFor="inputAddress"
                                  style={{
                                    backgroundColor: '#4d3227',
                                    color: 'white',
                                  }}
                                >
                                  Rake Information
                                </CFormLabel>
                              </CCol>
                            </CRow>
                          )}
                          {stoTableDataRMSTO.map((data_val, index_val) => {
                            //console.log(data_val, 'data_val-stoTableDataRMSTO.map rake')
                            if (data_val.sto_delivery_number_rmsto == '') {
                              return (
                                <>
                                  <CRow className="mt-2" key={`rmsto_data_${index_val}`}>
                                    <CCol md={2}>
                                      <CFormLabel>FNR Number</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_fnr_number_rmsto}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol md={2}>
                                      <CFormLabel>VA Number</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_va_number_rmsto}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol md={2}>
                                      <CFormLabel>MIGO Number</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_migo_number_rmsto}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol md={2}>
                                      <CFormLabel>STO PO Number</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_po_number_rmsto}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol md={2}>
                                      <CFormLabel>Division</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_delivery_division_rmsto}
                                        readOnly
                                      />
                                    </CCol>
                                    {data_val.sto_driver_name_rmsto != '' && (
                                      <CCol md={2}>
                                        <CFormLabel>Driver Name</CFormLabel>
                                        <CFormInput
                                          size="sm"
                                          value={data_val.sto_driver_name_rmsto}
                                          readOnly
                                        />
                                      </CCol>
                                    )}
                                    <CCol md={2}>
                                      <CFormLabel>Receiving Plant</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_to_location_rmsto}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol md={2}>
                                      <CFormLabel>Delivery Qty in MTS</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_delivery_quantity_rmsto}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol md={2}>
                                      <CFormLabel>Freight Amount</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_freight_amount_rmsto}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol xs={12} md={2}>
                                      <CFormLabel>Delivery Date and Time</CFormLabel>

                                      <CFormInput
                                        size="sm"
                                        type="datetime-local"
                                        name="sto_delivery_date_time_rmsto"
                                        // value={stoValuesRMSTO[index_val].sto_delivery_date_time_rmsto}
                                        onChange={(e) => handleStoValueChangeRMSTO(e, index_val)}
                                      />
                                    </CCol>
                                    {stoValuesRMSTO && stoValuesRMSTO.length > 0 && (
                                      <CCol xs={12} md={2}>
                                        <CFormLabel>POD Copy</CFormLabel>{' '}
                                        {/* Own Vehicle RMSTO POD Copy - OVRPC */}
                                        <CButton
                                          className="w-100 m-0"
                                          color="info"
                                          size="sm"
                                          id="inputAddress"
                                        >
                                          {/* {//console.log(stoValuesRMSTO,'stoValuesRMSTO - Own Vehicle RMSTO POD Copy - OVRPC')} */}
                                          {!(
                                            stoValuesRMSTO[index_val] &&
                                            stoValuesRMSTO[index_val].sto_pod_copy_rmsto_file_upload
                                          ) ? (
                                            <>
                                              <span
                                                className="float-start"
                                                onClick={() => {
                                                  uploadClick(index_val)
                                                }}
                                              >
                                                <CIcon
                                                  style={{ color: 'red' }}
                                                  icon={icon.cilFolderOpen}
                                                  size="lg"
                                                />
                                                &nbsp;Upload
                                              </span>
                                              <span
                                                style={{ marginRight: '10%' }}
                                                className="mr-10 float-end"
                                                onClick={() => {
                                                  setFileImageKey(index_val)
                                                  setCamEnableType('rmsto')
                                                  setCamEnable(true)
                                                }}
                                              >
                                                <CIcon
                                                  style={{ color: 'red' }}
                                                  icon={icon.cilCamera}
                                                  size="lg"
                                                />
                                                &nbsp;Camera
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <span className="float-start">
                                                &nbsp;
                                                {stoValuesRMSTO[index_val]
                                                  ? stoValuesRMSTO[index_val]
                                                      .sto_pod_copy_rmsto_file_name
                                                  : ''}
                                              </span>
                                              <span className="float-end">
                                                <i
                                                  className="fa fa-trash"
                                                  aria-hidden="true"
                                                  onClick={() => {
                                                    clearValues(index_val, 'rmsto')
                                                  }}
                                                ></i>
                                              </span>
                                            </>
                                          )}
                                        </CButton>
                                        <CFormInput
                                          onBlur={onBlur}
                                          onChange={(e) =>
                                            handleStoFileUploadChangeRMSTO(e, index_val)
                                          }
                                          type="file"
                                          accept=".jpg,.jpeg,.png,.pdf"
                                          name={'sto_pod_copy_rmsto'}
                                          size="sm"
                                          id={`sto_pod_copy_rmsto_upload_yes_${index_val}`}
                                          style={{ display: 'none' }}
                                        />
                                      </CCol>
                                    )}

                                    {/* Without Camera : Own Vehicle RMSTO POD Copy - OVRPC */}
                                    {/* <CCol xs={12} md={2} style={{display:'none'}}>
                                          <CFormLabel>POD Copy</CFormLabel>
                                          <CFormInput
                                            type="file"
                                            size="sm"
                                            accept=".jpg,.jpeg,.png,.pdf"
                                            name="sto_pod_copy_rmsto"
                                            onChange={(e) => handleStoFileUploadChangeRMSTO(e, index_val)}
                                          />
                                        </CCol> */}
                                  </CRow>
                                  <hr />
                                </>
                              )
                            }
                          })}
                        </div>
                      </div>
                    </CTabPane>
                  )}
                  {/* Own Vehicle RMSTO Info Tab END====================================== */}
                  {/* ======= Own Vehicle Others Info Tab START ASK5 ======= */}
                  {tabGISuccess && (
                    <CTabPane
                      role="tabpanel"
                      aria-labelledby="contact-tab"
                      visible={activeKey_2 === 12}
                    >
                      <div className="App">
                        <div>
                          <CRow className="mt-2">
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="ot_veh_insurence_valid">
                                Process Type
                                <REQ />{' '}
                              </CFormLabel>
                              {!stoOthersDeliveryEdit && (
                                <>
                                  <CFormSelect
                                    size="sm"
                                    name="ot_process_type"
                                    id="ot_process_type"
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onChange={handleChange}
                                    value={values.ot_process_type}
                                  >
                                    <option value="">Select ...</option>
                                    <option value="1">Returnable No.</option>
                                    <option value="2">Non Returnable No.</option>
                                    <option value="3">Returnable Receipt No.</option>
                                    <option value="4">Purchase PO No.</option>
                                    <option value="5">STO PO No.</option>
                                    <option value="6">Delivery No.</option>
                                    <option value="7">Purchase Migo No.</option>
                                    <option value="8">STO Migo No.</option>
                                    <option value="9">FG-Sales Return / Credit Memo No.</option>
                                    <option value="10">RM Sales / Bill Of Supply No.</option>
                                    {/* <option value="11">Gate Pass No.</option> */}
                                    <option value="12">Delivery Challan No.</option>
                                  </CFormSelect>
                                </>
                              )}
                              {stoOthersDeliveryEdit && (
                                <CFormInput
                                  size="sm"
                                  value={stoOthersValues.others_sto_process_type}
                                  id="others_sto_process_type"
                                  readOnly
                                />
                              )}
                            </CCol>
                            {values.ot_process_type != '' && (
                              <>
                                <CCol md={2}>
                                  <CFormLabel>
                                    Document Number <REQ />
                                  </CFormLabel>
                                  <CInputGroup>
                                    {!stoOthersDeliveryEdit && (
                                      <>
                                        <CFormInput
                                          size="sm"
                                          value={stoOthersValues.others_sto_doc_number}
                                          onChange={(e) => handleStoOthersValueChange(e)}
                                          name={'others_sto_doc_number'}
                                          maxLength={12}
                                        />
                                        <CInputGroupText className="p-0">
                                          <CButton
                                            size="sm"
                                            color="success"
                                            onClick={(e) => {
                                              setFetch(false)
                                              getOthersSapData(e)
                                            }}
                                          >
                                            <i className="fa fa-check px-1"></i>
                                          </CButton>
                                        </CInputGroupText>
                                      </>
                                    )}
                                    {stoOthersDeliveryEdit && (
                                      <CFormInput
                                        size="sm"
                                        value={stoOthersValues.others_sto_doc_number}
                                        id="others_sto_doc_number"
                                        readOnly
                                      />
                                    )}
                                  </CInputGroup>
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>Doc. date</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={stoOthersValues.others_sto_doc_date || '-'}
                                    name={others_sto_doc_date}
                                    maxLength={1}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>
                                    STO PO Number <REQ />
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={stoOthersValues.others_sto_po_number || '-'}
                                    name={others_sto_po_number}
                                    maxLength={1}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>
                                    Vendor Code <REQ />
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={stoOthersValues.others_sto_vendor_code || '-'}
                                    name={others_sto_vendor_code}
                                    maxLength={1}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>
                                    Vendor name <REQ />
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={stoOthersValues.others_sto_vendor_name || '-'}
                                    name={others_sto_vendor_name}
                                    maxLength={1}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>
                                    From Plant Code <REQ />
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={stoOthersValues.others_sto_from_plant_code || '-'}
                                    name={others_sto_from_plant_code}
                                    maxLength={1}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>
                                    From Plant name <REQ />
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={stoOthersValues.others_sto_from_plant_name || '-'}
                                    name={others_sto_from_plant_name}
                                    maxLength={1}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>
                                    To Plant Code <REQ />
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={stoOthersValues.others_sto_to_plant_code || '-'}
                                    name={others_sto_to_plant_code}
                                    maxLength={1}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>
                                    To Plant name <REQ />
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={stoOthersValues.others_sto_to_plant_name || '-'}
                                    name={others_sto_to_plant_name}
                                    maxLength={1}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>
                                    Inco term <REQ />
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={stoOthersValues.others_sto_incoterm || '-'}
                                    name={others_sto_incoterm}
                                    maxLength={1}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>
                                    Net Weight <REQ />
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={stoOthersValues.others_sto_net_weight || '-'}
                                    name={others_sto_net_weight}
                                    maxLength={1}
                                    readOnly
                                  />
                                </CCol>
                                <CCol md={2}>
                                  <CFormLabel>
                                    Customer Code
                                    <REQ />
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={stoOthersValues.others_sto_customer_code || '-'}
                                    name={others_sto_customer_code}
                                    maxLength={1}
                                    readOnly
                                  />
                                </CCol>

                                <CCol md={2}>
                                  <CFormLabel>
                                    Assignment <REQ />
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={stoOthersValues.others_sto_assignment || '-'}
                                    name={others_sto_assignment}
                                    maxLength={1}
                                    readOnly
                                  />
                                </CCol>

                                <CCol md={2}>
                                  <CFormLabel>
                                    VA number <REQ />
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={stoOthersValues.others_sto_va_no || '-'}
                                    name={others_sto_va_no}
                                    maxLength={1}
                                    readOnly
                                  />
                                </CCol>

                                <CCol md={2}>
                                  <CFormLabel>
                                    Truck no <REQ />
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={stoOthersValues.others_sto_truck_no || '-'}
                                    name={others_sto_truck_no}
                                    maxLength={1}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel>
                                    Delivery Qty in MTS <REQ />
                                  </CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    // type="number"
                                    value={
                                      stoOthersValues.others_sto_delivery_quantity
                                        ? stoOthersValues.others_sto_delivery_quantity
                                        : stoDeliveryEdit
                                        ? stoValues.others_sto_delivery_quantity
                                        : ''
                                    }
                                    onChange={(e) => handleStoOthersValueChange(e)}
                                    name={others_sto_delivery_quantity}
                                    maxLength={5}
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel>
                                    Inc.Freight Amount <REQ />
                                  </CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    value={
                                      stoOthersValues.others_sto_freight_amount
                                        ? stoOthersValues.others_sto_freight_amount
                                        : stoDeliveryEdit
                                        ? stoValues.freight_amount
                                        : ''
                                    }
                                    onChange={(e) => handleStoOthersValueChange(e)}
                                    name={others_sto_freight_amount}
                                    maxLength={6}
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="others_sto_vr_id">
                                    Vehicle Request No <REQ />{' '}
                                  </CFormLabel>
                                  <CFormSelect
                                    size="sm"
                                    name="others_sto_vr_id"
                                    // onChange={handleChange}
                                    onFocus={onFocus}
                                    value={
                                      stoOthersValues.others_sto_vr_id
                                        ? stoOthersValues.others_sto_vr_id
                                        : stoDeliveryEdit
                                        ? stoValues.others_sto_vr_id
                                        : ''
                                    }
                                    // value={others_sto_vr_id}
                                    onChange={(e) => handleStoOthersValueChange(e)}
                                    className={`mb-1 ${errors.others_sto_vr_id && 'is-invalid'}`}
                                    aria-label="Small select example"
                                    id="others_sto_vr_id"
                                  >
                                    <option value="">Select ...</option>
                                    {vrData.map(
                                      ({ vr_id, vr_no, vr_division, vr_purpose, request_by }) => {
                                        return (
                                          <>
                                            <option key={vr_id} value={vr_id}>
                                              {`${vr_no} (${div_finder(
                                                vr_division
                                              )} - ${purp_finder(vr_purpose)} : By ${request_by})`}
                                            </option>
                                          </>
                                        )
                                      }
                                    )}
                                  </CFormSelect>
                                </CCol>

                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="tNum">Division</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="tNum"
                                    value={
                                      stoOthersValues.others_sto_vr_id == ''
                                        ? '--'
                                        : div_finder_by_vr_id(stoOthersValues.others_sto_vr_id)
                                    }
                                    readOnly
                                  />
                                </CCol>
                                {/* <CCol xs={12} md={2}>
                                <CFormLabel>Delivery Date and Time</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  type="datetime-local"
                                  value={
                                    stoValues.others_sto_delivered_date
                                      ? stoValues.others_sto_delivered_date
                                      : stoDeliveryEdit
                                      ? stoValues.delivered_date_time
                                      : ''
                                  }
                                  onChange={(e) => handleStoValueChange(e)}
                                  name={others_sto_delivered_date}
                                />
                              </CCol>
                              <CCol xs={12} md={2}>
                                <CFormLabel>POD Copy</CFormLabel>
                                {stoFileUploadVisible ? (
                                  <CFormInput
                                    type="file"
                                    size="sm"
                                    value={stoValues.sto_pod_copy}
                                    // onChange={(e) => handleStoValueChange(e)}
                                    onChange={(e) => handleStoFileUploadChange(e)}
                                    name={sto_pod_copy}
                                  />
                                ) : (
                                  <CButton className="w-100 m-0" color="info" size="sm" id="dInvoice">
                                    <span className="float-start" onClick={() => setStoPodVisible(true)}>
                                      <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                                    </span>
                                    <span
                                      className="float-end"
                                      onClick={() => {
                                        if (window.confirm('Are you sure to remove this file?')) {
                                          stoPodUploadResetEdit()
                                        }
                                      }}
                                    >
                                      <i className="fa fa-trash" aria-hidden="true"></i>
                                    </span>
                                  </CButton>
                                )}
                              </CCol> */}
                              </>
                            )}

                            {/* <CCol md={2}>
                            <CFormLabel>
                              Driver Name <REQ />{' '}
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              value={stoValues.sto_delivery_driver_name}
                              onChange={(e) => handleStoValueChange(e)}
                              name={sto_delivery_driver_name}
                            >
                              <AllDriverListNameSelectComponent />
                            </CFormSelect>{' '}
                          </CCol> */}
                            {/* <CCol xs={12} md={2}>
                            <CFormLabel>Expense To Be Capture</CFormLabel>

                            <CTableDataCell scope="row">
                              <input
                                className="form-check-input"
                                style={{ minHeight: '18px !important' }}
                                type="checkbox"
                                checked={stoValues.sto_delivery_expense_capture}
                                value={stoValues.sto_delivery_expense_capture}
                                onChange={(e) => handleStoExpenseCaptureChange(e)}
                                name={sto_delivery_expense_capture}
                              />
                            </CTableDataCell>
                          </CCol> */}
                          </CRow>
                        </div>
                      </div>

                      {/* {stoOthersTableData && (stoOthersTableData.length < 1 || isOthersStoEditMode) && ( */}
                      <div
                        className="App"
                        style={{ display: 'flex', flexDirection: 'row-reverse' }}
                      >
                        <CButton
                          className="m-2"
                          disabled={!isOthersStoEditMode && stoOthersDeliveryInvalid ? true : false}
                          onClick={(e) =>
                            onOthersStoSubmitBtn(e, isOthersStoEditMode ? 'Update' : 'Add')
                          }
                          // onClick={onOthersStoSubmitBtn}
                          color="primary"
                        >
                          {isOthersStoEditMode ? 'Update' : 'Add'}
                        </CButton>{' '}
                        <CButton
                          className="m-2"
                          onClick={onOthersStoSubmitCancelBtn}
                          color="primary"
                        >
                          Clear
                        </CButton>
                        {isOthersStoEditMode && (
                          <CButton className="m-2" onClick={stoOthersResetEdit} color="primary">
                            Cancel Edit
                          </CButton>
                        )}
                        <br />
                      </div>
                      {/* )} */}
                      <hr />
                      <StoTableOthersComponent
                        stoOthersTableData={stoOthersTableData}
                        tripInfo={tripInfo}
                        title="Others Information Table"
                        onEdit={onOthersStoEditcallback}
                        onDelete={onOthersStoDeleteCallback}
                        isOthersStoEditMode={isOthersStoEditMode}
                        hireVehicle={
                          tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id &&
                          tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id == 22
                            ? true
                            : false
                        }
                      />
                    </CTabPane>
                  )}
                  {/* ======= Own Vehicle Others Info Tab End ASK6 ======= */}
                  {/* Own Vehicle FCI Info Tab START================================= */}
                  {tabGISuccess && (
                    <CTabPane
                      role="tabpanel"
                      aria-labelledby="contact-tab"
                      visible={activeKey_2 === 13}
                    >
                      <div className="App">
                        <div>
                          {stoTableDataFCI.length == 0 && (
                            <>
                              <div className="m-5">
                                <h2>There are no delivery records to display..</h2>
                              </div>
                            </>
                          )}
                          {FCIInfoAvailable(stoTableDataFCI) && (
                            <CRow className="mt-2" hidden>
                              <CCol xs={12} md={3}>
                                <CFormLabel
                                  htmlFor="inputAddress"
                                  style={{
                                    backgroundColor: '#4d3227',
                                    color: 'white',
                                  }}
                                >
                                  FCI Information
                                </CFormLabel>
                              </CCol>
                            </CRow>
                          )}
                          {stoTableDataFCI.map((data_val, index_val) => {
                            //console.log(data_val, 'data_val-stoTableDataFCI.map own')
                            if (data_val.sto_delivery_number_rmsto != '') {
                              return (
                                <>
                                  <CRow className="mt-2" key={`rmsto_data_${index_val}`}>
                                    <CCol md={2}>
                                      <CFormLabel>STO PO Number</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_po_number_fci}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol md={2}>
                                      <CFormLabel>STO Migo Number</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_migo_number_fci}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol md={2}>
                                      <CFormLabel>STO VA Number</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_va_number_fci}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol md={2}>
                                      <CFormLabel>Division</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_delivery_division_fci}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol md={2}>
                                      <CFormLabel>From Location Code</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_from_location_fci}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol md={2}>
                                      <CFormLabel>To Location Code</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_to_location_fci}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol md={2}>
                                      <CFormLabel>NLLD Vendor Type</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={
                                          data_val.sto_vendor_status_fci == 1
                                            ? 'Freight Only Vendor'
                                            : 'Freight & Loading Vendor'
                                        }
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol md={2}>
                                      <CFormLabel>Delivery Qty in MTS</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_delivery_quantity_fci}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol md={2}>
                                      <CFormLabel>Freight Amount</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data_val.sto_base_freight_amount_fci}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol xs={12} md={2}>
                                      <CFormLabel>Delivery Date and Time</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        type="datetime-local"
                                        name="sto_delivery_date_time_fci"
                                        onChange={(e) => handleStoValueChangeFci(e, index_val)}
                                      />
                                    </CCol>

                                    {/* Without Camera : Own Vehicle FCI POD Copy - OVRPC */}
                                    <CCol xs={12} md={2}>
                                      <CFormLabel>POD Copy</CFormLabel>
                                      <CFormInput
                                        type="file"
                                        size="sm"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        name="sto_pod_copy_fci"
                                        onChange={(e) => handleStoFileUploadChangeFci(e, index_val)}
                                      />
                                    </CCol>
                                  </CRow>
                                  <hr />
                                </>
                              )
                            }
                          })}
                        </div>
                      </div>
                    </CTabPane>
                  )}
                  {/* Own Vehicle FCI Info Tab END====================================== */}
                  {/* Own Vehicle Diesel Indent Info Tab Start============================ */}
                  <CTabPane
                    role="tabpanel"
                    aria-labelledby="contact-tab"
                    visible={activeKey_2 === 5}
                  >
                    <CRow className="mt-2" hidden>
                      <CCol xs={12} md={3}>
                        <CFormLabel
                          htmlFor="inputAddress"
                          style={{
                            backgroundColor: '#4d3227',
                            color: 'white',
                          }}
                        >
                          Diesel Filling :{' '}
                        </CFormLabel>
                      </CCol>
                    </CRow>
                    {Array.isArray(dieselCollectionInfo) &&
                      dieselCollectionInfo.length > 0 &&
                      dieselCollectionInfo.map((data, index) => {
                        //console.log(dieselCollectionInfo, 'dieselCollectionInfo87878')
                        if (data.diesel_type == '0') {
                          return (
                            <>
                              <CRow className="mt-2" hidden>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="dVendor1">Local Reg. Vendor</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="rNum"
                                    value={
                                      data.diesel_vendor_sap_invoice_no == null
                                        ? '-'
                                        : getDieselVendorNameById(data.diesel_vendor_id)
                                    }
                                    readOnly
                                  />
                                  {/* <CFormInput size="sm" id="dVendor1" readOnly /> */}
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="dltr1">Diesel Liter</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="rNum"
                                    value={
                                      data.diesel_vendor_sap_invoice_no == null
                                        ? '-'
                                        : data.no_of_ltrs
                                    }
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="rltr">Rate Per Liter</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="rNum"
                                    value={
                                      data.diesel_vendor_sap_invoice_no == null
                                        ? '-'
                                        : data.rate_of_ltrs
                                    }
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="tAmount">Total Amount</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="rNum"
                                    value={
                                      data.diesel_vendor_sap_invoice_no == null
                                        ? '-'
                                        : data.total_amount
                                    }
                                    readOnly
                                  />
                                </CCol>
                                {!adhardel && (
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="dInvoice">Invoice Copy</CFormLabel>
                                    {dieselInvoiceVisible ? (
                                      <CFormInput
                                        type="file"
                                        name="dInvoice"
                                        size="sm"
                                        id="dInvoice"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                      />
                                    ) : (
                                      <CButton
                                        className="w-100 m-0"
                                        color="info"
                                        size="sm"
                                        id="dInvoice"
                                        disabled={
                                          data.diesel_vendor_sap_invoice_no == null ? true : false
                                        }
                                      >
                                        <span
                                          className="float-start"
                                          onClick={() => setDieselInvoiceAttachmentVisible(true)}
                                        >
                                          <i className="fa fa-eye" aria-hidden="true"></i>{' '}
                                          &nbsp;View
                                        </span>
                                        {/* <span
                              className="float-end"
                              onClick={() => {
                                if (window.confirm('Are you sure to remove this file?')) {
                                  setDieselInvoiceVisible(true)
                                }
                              }}
                            >
                              <i className="fa fa-trash" aria-hidden="true"></i>
                            </span> */}
                                      </CButton>
                                    )}
                                  </CCol>
                                )}

                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="tAmount">Driver Name</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="tAmount"
                                    value={tripInfo.driver_name}
                                    type=""
                                    readOnly
                                  />
                                </CCol>
                              </CRow>
                              {/* Diesel Invoice Photo View Start */}
                              <CModal
                                visible={dieselInvoiceAttachmentVisible}
                                onClose={() => setDieselInvoiceAttachmentVisible(false)}
                              >
                                <CModalHeader>
                                  <CModalTitle>Diesel Invoice Copy</CModalTitle>
                                </CModalHeader>
                                <CModalBody>
                                  {!data.invoice_copy.includes('.pdf') ? (
                                    <CCardImage orientation="top" src={data.invoice_copy} />
                                  ) : (
                                    <iframe
                                      orientation="top"
                                      height={500}
                                      width={475}
                                      src={data.invoice_copy}
                                    ></iframe>
                                  )}
                                </CModalBody>

                                <CModalFooter>
                                  <CButton
                                    color="secondary"
                                    onClick={() => setDieselInvoiceAttachmentVisible(false)}
                                  >
                                    Close
                                  </CButton>
                                </CModalFooter>
                              </CModal>
                              {/* Diesel Invoice Photo View End  */}
                            </>
                          )
                        }
                      })}
                    {/* ------------------------------registered Vendor--------------------------*/}
                    {Array.isArray(dieselCollectionInfo) &&
                      dieselCollectionInfo.length > 0 &&
                      dieselCollectionInfo.map((data, index) => {
                        if (data.diesel_type == '1') {
                          return (
                            <>
                              <CRow className="mt-2" hidden>
                                <CCol md={2}>
                                  <CFormLabel htmlFor="rVendor">Outstation Reg. Vendor </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="rNum"
                                    value={
                                      data.diesel_vendor_sap_invoice_no == null
                                        ? '-'
                                        : getDieselVendorNameById(data.diesel_vendor_id)
                                    }
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="dltr1">Diesel Liter</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="rNum"
                                    value={
                                      data.diesel_vendor_sap_invoice_no == null
                                        ? '-'
                                        : data.no_of_ltrs
                                    }
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="rltr">Rate Per Liter</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="rNum"
                                    value={
                                      data.diesel_vendor_sap_invoice_no == null
                                        ? '-'
                                        : data.rate_of_ltrs
                                    }
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="tAmount">Total Amount</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="rNum"
                                    value={
                                      data.diesel_vendor_sap_invoice_no == null
                                        ? '-'
                                        : data.total_amount
                                    }
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="dInvoice">Invoice Copy</CFormLabel>

                                  <CButton
                                    className="w-100 m-0"
                                    color="info"
                                    size="sm"
                                    disabled={
                                      data.diesel_vendor_sap_invoice_no == null ? true : false
                                    }
                                    id="dInvoice"
                                  >
                                    <span
                                      className="float-start"
                                      onClick={() => {
                                        setDieselInvoiceAttachmentVisible1(true)
                                        setDieselInvoiceAttachmentVisible1Index(index)
                                      }}
                                    >
                                      <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                                    </span>
                                  </CButton>
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="tAmount">Driver Name</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="tAmount"
                                    value={tripInfo.driver_name}
                                    type=""
                                    readOnly
                                  />
                                </CCol>
                              </CRow>
                            </>
                          )
                        }
                      })}
                    {/* -----------------------------Unregistered Vendor---------------------------------*/}
                    <CRow className="mt-2" hidden>
                      <CCol md={2}>
                        <CFormLabel htmlFor="urvName">Enroute Vendor</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="urvName"
                          onChange={(e) => onChangeURVItem(e)}
                          name="urvName"
                          maxLength={30}
                          value={urvValues.urvName || ''}
                        />
                      </CCol>
                      <CCol xs={12} md={2}>
                        <CFormLabel htmlFor="urvDieselLiter">Diesel Liter</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="urvDieselLiter"
                          onChange={(e) => onChangeURVItem(e)}
                          name="urvDieselLiter"
                          maxLength={7}
                          value={urvValues.urvDieselLiter || ''}
                        />
                      </CCol>
                      <CCol xs={12} md={2}>
                        <CFormLabel htmlFor="urvDieselRate">Rate Per Liter</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="urvDieselRate"
                          onChange={(e) => onChangeURVItem(e)}
                          name="urvDieselRate"
                          maxLength={7}
                          value={urvValues.urvDieselRate || ''}
                        />
                      </CCol>
                      <CCol xs={12} md={2}>
                        <CFormLabel htmlFor="urvDieselAmount">Total Amount </CFormLabel>

                        <CFormInput
                          size="sm"
                          id="urvDieselAmount"
                          // onChange={(e) => onChangeURVItem(e)}
                          name="urvDieselAmount"
                          maxLength={5}
                          value={urvTotalAmountFinder}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={2}>
                        <CFormLabel htmlFor="enroute_payment">Payment Mode </CFormLabel>
                        <CFormSelect
                          size="sm"
                          name="enroute_payment"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          value={values.enroute_payment}
                          aria-label="Small select example"
                          id="enroute_payment"
                        >
                          <option value="1" selected>
                            Cash Payment
                          </option>
                          <option value="2">Bank Payment</option>
                        </CFormSelect>
                      </CCol>

                      <CCol xs={12} md={2}>
                        <CFormLabel htmlFor="urvInvoice">Invoice Copy</CFormLabel>
                        <CFormInput
                          type="file"
                          size="sm"
                          id="urvInvoice"
                          onChange={(e) => onChangeURVItem(e)}
                          name="urvInvoice"
                          value={urvValues.urvInvoice || ''}
                        />
                      </CCol>
                    </CRow>

                    <CRow className="mt-2" hidden>
                      <CCol xs={12} md={2}>
                        <CFormLabel
                          htmlFor="inputAddress"
                          style={{
                            backgroundColor: '#4d3227',
                            color: 'white',
                          }}
                        ></CFormLabel>
                      </CCol>
                      <CCol xs={12} md={2}>
                        <CFormLabel htmlFor="urvInvoice">Total Diesel Liter</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="urvInvoice"
                          name="urvInvoice"
                          value={parseFloat(tdlDieselInfo.toFixed(2))}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={2}>
                        <CFormLabel htmlFor="rvAverageRatePerLiter">
                          Average Rate Per Liter
                        </CFormLabel>

                        <CFormInput
                          size="sm"
                          id="rvAverageRatePerLiter"
                          name="rvAverageRatePerLiter"
                          value={parseFloat(arplDieselInfo.toFixed(2))}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={2}>
                        <CFormLabel htmlFor="rvTotalDieselAmount">Total Diesel Amount</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="rvTotalDieselAmount"
                          name="rvTotalDieselAmount"
                          value={parseFloat(tdaDieselInfo.toFixed(2))}
                          readOnly
                        />
                      </CCol>
                    </CRow>
                    <hr />
                    {/* <ReactTable /> */}

                    {/* ----------------Diesel Consumption & Runnnig KM :---------------------------*/}
                    <CRow className="mt-2" hidden>
                      <CCol xs={12} md={3}>
                        <CFormLabel
                          htmlFor="inputAddress"
                          style={{
                            backgroundColor: '#4d3227',
                            color: 'white',
                          }}
                        >
                          {/* Diesel Consumption & Runnnig KM :{' '} */}
                          Diesel Consumption Ltr (Aprox.) & Runnnig KM{' '}
                        </CFormLabel>
                      </CCol>
                    </CRow>
                    {shipmentInfo && shipmentInfo.length > 0 && (
                      <>
                        <CRow className="mt-2" hidden>
                          <CCol xs={12} md={3}>
                            <CFormLabel
                              htmlFor="inputAddress"
                              style={{
                                backgroundColor: '#4d3227',
                                color: 'white',
                              }}
                            >
                              FG SALES
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        {shipmentInfo.map((siData, index) => {
                          return (
                            <>
                              <CRow className="mt-2" key={`shipmentInfo${index}`}>
                                <CCol md={2}>
                                  <CFormLabel htmlFor="fjNum">Shipment Number </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="fjNum"
                                    value={siData.shipment_no}
                                    readOnly
                                  />
                                </CCol>

                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="dCons">Diesel Cons. Qty Ltr</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    onChange={(e) => {
                                      changeVadTableItemForDCC(
                                        e,
                                        'diesel_cons_qty_ltr',
                                        index,
                                        parseFloat(arplDieselInfo.toFixed(2))
                                      )
                                    }}
                                    value={vadDataUpdateForDCC(
                                      siData.diesel_cons_qty_ltr,
                                      siData.diesel_cons_qty_ltr_input
                                    )}
                                    maxLength={6}
                                  />
                                  {siData.diesel_cons_qty_ltr_validated === false && (
                                    <span className="small text-danger">Required</span>
                                  )}
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="aLtr">Average Rate/Liter</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type=""
                                    id="aLtr"
                                    value={parseFloat(arplDieselInfo.toFixed(2))}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="tdAmt">Total Diesel Amount</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="tdAmt"
                                    value={vadDataUpdateForDCC(
                                      siData.diesel_amount,
                                      siData.diesel_amount_input
                                    )}
                                    readOnly
                                  />
                                </CCol>

                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="openKM">Opening KM</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    onChange={(e) => {
                                      changeVadTableItemForDCC(e, 'opening_km', index)
                                    }}
                                    value={vadDataUpdateForDCC(
                                      siData.opening_km,
                                      siData.opening_km_input
                                    )}
                                    maxLength={6}
                                  />
                                  {siData.opening_km_validated === false && (
                                    <span className="small text-danger">Required</span>
                                  )}
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="closeKM">Closing KM</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    onChange={(e) => {
                                      changeVadTableItemForDCC(e, 'closing_km', index)
                                    }}
                                    value={vadDataUpdateForDCC(
                                      siData.closing_km,
                                      siData.closing_km_input
                                    )}
                                    maxLength={6}
                                  />
                                  {siData.closing_km_validated === false && (
                                    <span className="small text-danger">Required</span>
                                  )}
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="runKM">Running KM</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="runKM"
                                    value={vadDataUpdateForDCC(
                                      siData.running_km,
                                      siData.running_km_input
                                    )}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="loadTon">Load Tonnage in MTS</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="loadTon"
                                    // value={siData.shipment_qty}
                                    value={siData.billed_net_qty}
                                    readOnly
                                  />
                                </CCol>
                              </CRow>
                            </>
                          )
                        })}
                        <hr />
                      </>
                    )}

                    {rjsoInfo && rjsoInfo.length > 0 && (
                      <>
                        <CRow className="mt-2" hidden>
                          <CCol xs={12} md={3}>
                            <CFormLabel
                              htmlFor="inputAddress"
                              style={{
                                backgroundColor: '#4d3227',
                                color: 'white',
                              }}
                            >
                              Return Journey Sales Order
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        {rjsoInfo.map((rjsoData, index) => {
                          return (
                            <>
                              <CRow className="mt-2" key={`rjsoInfo${index}`}>
                                <CCol md={2}>
                                  <CFormLabel htmlFor="fjNum">RJ SO Number </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="fjNum"
                                    value={rjsoData.rj_so_no}
                                    readOnly
                                  />
                                </CCol>

                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="dCons">Diesel Cons. Qty Ltr</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    onChange={(e) => {
                                      changeRjsoTableItemForDCC(
                                        e,
                                        'diesel_cons_qty_ltr',
                                        index,
                                        parseFloat(arplDieselInfo.toFixed(2))
                                      )
                                    }}
                                    value={rjsoDataUpdateForDCC(
                                      rjsoData.diesel_cons_qty_ltr,
                                      rjsoData.diesel_cons_qty_ltr_input
                                    )}
                                    maxLength={6}
                                  />
                                  {rjsoData.diesel_cons_qty_ltr_validated === false && (
                                    <span className="small text-danger">Required</span>
                                  )}
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="aLtr">Average Rate/Liter</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type=""
                                    id="aLtr"
                                    value={parseFloat(arplDieselInfo.toFixed(2))}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="tdAmt">Total Diesel Amount</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="tdAmt"
                                    value={rjsoDataUpdateForDCC(
                                      rjsoData.diesel_amount,
                                      rjsoData.diesel_amount_input
                                    )}
                                    readOnly
                                  />
                                </CCol>

                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="openKM">Opening KM</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    onChange={(e) => {
                                      changeRjsoTableItemForDCC(e, 'opening_km', index)
                                    }}
                                    value={rjsoDataUpdateForDCC(
                                      rjsoData.opening_km,
                                      rjsoData.opening_km_input
                                    )}
                                    maxLength={6}
                                  />
                                  {rjsoData.opening_km_validated === false && (
                                    <span className="small text-danger">Required</span>
                                  )}
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="closeKM">Closing KM</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    onChange={(e) => {
                                      changeRjsoTableItemForDCC(e, 'closing_km', index)
                                    }}
                                    value={rjsoDataUpdateForDCC(
                                      rjsoData.closing_km,
                                      rjsoData.closing_km_input
                                    )}
                                    maxLength={6}
                                  />
                                  {rjsoData.closing_km_validated === false && (
                                    <span className="small text-danger">Required</span>
                                  )}
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="runKM">Running KM</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="runKM"
                                    value={rjsoDataUpdateForDCC(
                                      rjsoData.running_km,
                                      rjsoData.running_km_input
                                    )}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="loadTon">Load Tonnage</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="loadTon"
                                    value={`${rjsoData.order_qty} - ${uomName(rjsoData.uom_id)}`}
                                    readOnly
                                  />
                                </CCol>
                              </CRow>
                            </>
                          )
                        })}
                        <hr />
                      </>
                    )}

                    {stoTableData && stoTableData.length > 0 && (
                      <>
                        <CRow className="mt-2" hidden>
                          <CCol xs={12} md={3}>
                            <CFormLabel
                              htmlFor="inputAddress"
                              style={{
                                backgroundColor: '#4d3227',
                                color: 'white',
                              }}
                            >
                              FGSTO
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        {stoTableData.map((fgstoData, index) => {
                          return (
                            <>
                              <CRow className="mt-2" key={`fgstoData${index}`}>
                                <CCol md={2}>
                                  <CFormLabel htmlFor="fjNum">FGSTO Delivery Number </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="fjNum"
                                    value={
                                      fgstoData.sto_delivery_number || fgstoData.sto_delivery_no
                                    }
                                    readOnly
                                  />
                                </CCol>

                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="dCons">Diesel Cons. Qty Ltr</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    onChange={(e) => {
                                      changeFgstoTableItemForDCC(
                                        e,
                                        'diesel_cons_qty_ltr',
                                        index,
                                        parseFloat(arplDieselInfo.toFixed(2))
                                      )
                                    }}
                                    value={fgstoDataUpdateForDCC(
                                      fgstoData.diesel_cons_qty_ltr,
                                      fgstoData.diesel_cons_qty_ltr_input
                                    )}
                                    maxLength={6}
                                  />
                                  {fgstoData.diesel_cons_qty_ltr_validated === false && (
                                    <span className="small text-danger">Required</span>
                                  )}
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="aLtr">Average Rate/Liter</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type=""
                                    id="aLtr"
                                    value={parseFloat(arplDieselInfo.toFixed(2))}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="tdAmt">Total Diesel Amount</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="tdAmt"
                                    value={fgstoDataUpdateForDCC(
                                      fgstoData.diesel_amount,
                                      fgstoData.diesel_amount_input
                                    )}
                                    readOnly
                                  />
                                </CCol>

                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="openKM">Opening KM</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    onChange={(e) => {
                                      changeFgstoTableItemForDCC(e, 'opening_km', index)
                                    }}
                                    value={fgstoDataUpdateForDCC(
                                      fgstoData.opening_km,
                                      fgstoData.opening_km_input
                                    )}
                                    maxLength={6}
                                  />
                                  {fgstoData.opening_km_validated === false && (
                                    <span className="small text-danger">Required</span>
                                  )}
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="closeKM">Closing KM</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    onChange={(e) => {
                                      changeFgstoTableItemForDCC(e, 'closing_km', index)
                                    }}
                                    value={fgstoDataUpdateForDCC(
                                      fgstoData.closing_km,
                                      fgstoData.closing_km_input
                                    )}
                                    maxLength={6}
                                  />
                                  {fgstoData.closing_km_validated === false && (
                                    <span className="small text-danger">Required</span>
                                  )}
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="runKM">Running KM</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="runKM"
                                    value={fgstoDataUpdateForDCC(
                                      fgstoData.running_km,
                                      fgstoData.running_km_input
                                    )}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="loadTon">Load Tonnage in MTS</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="loadTon"
                                    value={fgstoData.sto_delivery_quantity}
                                    readOnly
                                  />
                                </CCol>
                              </CRow>
                            </>
                          )
                        })}
                        <hr />
                      </>
                    )}

                    {stoOthersTableData && stoOthersTableData.length > 0 && (
                      <>
                        <CRow className="mt-2" hidden>
                          <CCol xs={12} md={3}>
                            <CFormLabel
                              htmlFor="inputAddress"
                              style={{
                                backgroundColor: '#4d3227',
                                color: 'white',
                              }}
                            >
                              Others
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        {stoOthersTableData.map((othersData, index) => {
                          return (
                            <>
                              <CRow className="mt-2" key={`othersData${index}`}>
                                <CCol md={2}>
                                  <CFormLabel htmlFor="fjNum">Others Doc. Number </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="fjNum"
                                    value={othersData.others_sto_doc_number}
                                    readOnly
                                  />
                                </CCol>

                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="dCons">Diesel Cons. Qty Ltr</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    onChange={(e) => {
                                      changeOthersTableItemForDCC(
                                        e,
                                        'diesel_cons_qty_ltr',
                                        index,
                                        parseFloat(arplDieselInfo.toFixed(2))
                                      )
                                    }}
                                    value={othersDataUpdateForDCC(
                                      othersData.diesel_cons_qty_ltr,
                                      othersData.diesel_cons_qty_ltr_input
                                    )}
                                    maxLength={6}
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="aLtr">Average Rate/Liter</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type=""
                                    id="aLtr"
                                    value={parseFloat(arplDieselInfo.toFixed(2))}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="tdAmt">Total Diesel Amount</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="tdAmt"
                                    value={othersDataUpdateForDCC(
                                      othersData.diesel_amount,
                                      othersData.diesel_amount_input
                                    )}
                                    readOnly
                                  />
                                </CCol>

                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="openKM">Opening KM</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    onChange={(e) => {
                                      changeOthersTableItemForDCC(e, 'opening_km', index)
                                    }}
                                    value={othersDataUpdateForDCC(
                                      othersData.opening_km,
                                      othersData.opening_km_input
                                    )}
                                    maxLength={6}
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="closeKM">Closing KM</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    onChange={(e) => {
                                      changeOthersTableItemForDCC(e, 'closing_km', index)
                                    }}
                                    value={othersDataUpdateForDCC(
                                      othersData.closing_km,
                                      othersData.closing_km_input
                                    )}
                                    maxLength={6}
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="runKM">Running KM</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="runKM"
                                    value={othersDataUpdateForDCC(
                                      othersData.running_km,
                                      othersData.running_km_input
                                    )}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="loadTon">Load Tonnage in MTS</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="loadTon"
                                    value={othersData.others_sto_delivery_quantity}
                                    readOnly
                                  />
                                </CCol>
                              </CRow>
                            </>
                          )
                        })}
                        <hr />
                      </>
                    )}

                    {stoTableDataFGSTO && stoTableDataFGSTO.length > 0 && (
                      <>
                        <CRow className="mt-2" hidden>
                          <CCol xs={12} md={3}>
                            <CFormLabel
                              htmlFor="inputAddress"
                              style={{
                                backgroundColor: '#4d3227',
                                color: 'white',
                              }}
                            >
                              SAP : FGSTO
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        {stoTableDataFGSTO.map((fgstoData, index) => {
                          return (
                            <>
                              <CRow className="mt-2" key={`fgstoData${index}`}>
                                <CCol md={2}>
                                  <CFormLabel htmlFor="fjNum">FGSTO Delivery Number </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="fjNum"
                                    value={
                                      fgstoData.sto_delivery_number_fgsto ||
                                      fgstoData.sto_delivery_no_fgsto
                                    }
                                    readOnly
                                  />
                                </CCol>

                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="dCons">Diesel Cons. Qty Ltr</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    onChange={(e) => {
                                      changeSapFgstoTableItemForDCC(
                                        // changeFgstoTableItemForDCC(
                                        e,
                                        'diesel_cons_qty_ltr',
                                        index,
                                        parseFloat(arplDieselInfo.toFixed(2))
                                      )
                                    }}
                                    value={sapFgstoDataUpdateForDCC(
                                      fgstoData.diesel_cons_qty_ltr,
                                      fgstoData.diesel_cons_qty_ltr_input
                                    )}
                                    maxLength={6}
                                  />
                                  {fgstoData.diesel_cons_qty_ltr_validated === false && (
                                    <span className="small text-danger">Required</span>
                                  )}
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="aLtr">Average Rate/Liter</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type=""
                                    id="aLtr"
                                    value={parseFloat(arplDieselInfo.toFixed(2))}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="tdAmt">Total Diesel Amount</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="tdAmt"
                                    // value={fgstoDataUpdateForDCC(
                                    value={sapFgstoDataUpdateForDCC(
                                      fgstoData.diesel_amount,
                                      fgstoData.diesel_amount_input
                                    )}
                                    readOnly
                                  />
                                </CCol>

                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="openKM">Opening KM</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    onChange={(e) => {
                                      // changeFgstoTableItemForDCC(e, 'opening_km', index)
                                      changeSapFgstoTableItemForDCC(e, 'opening_km', index)
                                    }}
                                    // value={fgstoDataUpdateForDCC(
                                    value={sapFgstoDataUpdateForDCC(
                                      fgstoData.opening_km,
                                      fgstoData.opening_km_input
                                    )}
                                    maxLength={6}
                                  />
                                  {fgstoData.opening_km_validated === false && (
                                    <span className="small text-danger">Required</span>
                                  )}
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="closeKM">Closing KM</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    onChange={(e) => {
                                      // changeFgstoTableItemForDCC(e, 'closing_km', index)
                                      changeSapFgstoTableItemForDCC(e, 'closing_km', index)
                                    }}
                                    value={fgstoDataUpdateForDCC(
                                      fgstoData.closing_km,
                                      fgstoData.closing_km_input
                                    )}
                                    maxLength={6}
                                  />
                                  {fgstoData.closing_km_validated === false && (
                                    <span className="small text-danger">Required</span>
                                  )}
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="runKM">Running KM</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="runKM"
                                    // value={fgstoDataUpdateForDCC(
                                    value={sapFgstoDataUpdateForDCC(
                                      fgstoData.running_km,
                                      fgstoData.running_km_input
                                    )}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="loadTon">Load Tonnage in MTS</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="loadTon"
                                    value={fgstoData.sto_delivery_quantity_fgsto}
                                    readOnly
                                  />
                                </CCol>
                              </CRow>
                            </>
                          )
                        })}
                        <hr />
                      </>
                    )}

                    {stoTableDataRMSTO && stoTableDataRMSTO.length > 0 && (
                      <>
                        <CRow className="mt-2" hidden>
                          <CCol xs={12} md={3}>
                            <CFormLabel
                              htmlFor="inputAddress"
                              style={{
                                backgroundColor: '#4d3227',
                                color: 'white',
                              }}
                            >
                              RMSTO
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        {stoTableDataRMSTO.map((rmstoData, index) => {
                          if (rmstoData.sto_delivery_number_rmsto != '') {
                            return (
                              <>
                                <CRow className="mt-2" key={`rmstoData${index}`}>
                                  <CCol md={2}>
                                    <CFormLabel htmlFor="fjNum">RMSTO Delivery Number </CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      id="fjNum"
                                      value={
                                        rmstoData.sto_delivery_number_rmsto ||
                                        rmstoData.sto_delivery_no
                                      }
                                      readOnly
                                    />
                                  </CCol>

                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="dCons">Diesel Cons. Qty Ltr</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="text"
                                      onChange={(e) => {
                                        changeRmstoTableItemForDCC(
                                          e,
                                          'diesel_cons_qty_ltr',
                                          index,
                                          parseFloat(arplDieselInfo.toFixed(2))
                                        )
                                      }}
                                      value={rmstoDataUpdateForDCC(
                                        rmstoData.diesel_cons_qty_ltr,
                                        rmstoData.diesel_cons_qty_ltr_input
                                      )}
                                      maxLength={6}
                                    />
                                    {rmstoData.diesel_cons_qty_ltr_validated === false && (
                                      <span className="small text-danger">Required</span>
                                    )}
                                  </CCol>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="aLtr">Average Rate/Liter</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type=""
                                      id="aLtr"
                                      value={parseFloat(arplDieselInfo.toFixed(2))}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="tdAmt">Total Diesel Amount</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      id="tdAmt"
                                      value={rmstoDataUpdateForDCC(
                                        rmstoData.diesel_amount,
                                        rmstoData.diesel_amount_input
                                      )}
                                      readOnly
                                    />
                                  </CCol>

                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="openKM">Opening KM</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="text"
                                      onChange={(e) => {
                                        changeRmstoTableItemForDCC(e, 'opening_km', index)
                                      }}
                                      value={rmstoDataUpdateForDCC(
                                        rmstoData.opening_km,
                                        rmstoData.opening_km_input
                                      )}
                                      maxLength={6}
                                    />
                                    {rmstoData.opening_km_validated === false && (
                                      <span className="small text-danger">Required</span>
                                    )}
                                  </CCol>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="closeKM">Closing KM</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="text"
                                      onChange={(e) => {
                                        changeRmstoTableItemForDCC(e, 'closing_km', index)
                                      }}
                                      value={rmstoDataUpdateForDCC(
                                        rmstoData.closing_km,
                                        rmstoData.closing_km_input
                                      )}
                                      maxLength={6}
                                    />
                                    {rmstoData.closing_km_validated === false && (
                                      <span className="small text-danger">Required</span>
                                    )}
                                  </CCol>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="runKM">Running KM</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      id="runKM"
                                      value={rmstoDataUpdateForDCC(
                                        rmstoData.running_km,
                                        rmstoData.running_km_input
                                      )}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="loadTon">Load Tonnage in MTS</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      id="loadTon"
                                      value={rmstoData.sto_delivery_quantity_rmsto}
                                      readOnly
                                    />
                                  </CCol>
                                </CRow>
                              </>
                            )
                          }
                        })}
                        <hr />
                      </>
                    )}

                    {RakeInfoAvailable(stoTableDataRMSTO) && (
                      <CRow className="mt-2" hidden>
                        <CCol xs={12} md={3}>
                          <CFormLabel
                            htmlFor="inputAddress"
                            style={{
                              backgroundColor: '#4d3227',
                              color: 'white',
                            }}
                          >
                            Rake Information
                          </CFormLabel>
                        </CCol>
                      </CRow>
                    )}
                    {stoTableDataRMSTO.map((rmstoData, index) => {
                      if (rmstoData.sto_delivery_number_rmsto == '') {
                        //console.log(rmstoData, 'rmstoDatarmstoData')
                        return (
                          <>
                            <CRow className="mt-2" key={`rmstoData${index}`}>
                              <CCol md={2}>
                                <CFormLabel htmlFor="fjNum">FNR Number </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="fjNum"
                                  value={rmstoData.sto_fnr_number_rmsto}
                                  readOnly
                                />
                              </CCol>
                              <CCol md={2}>
                                <CFormLabel htmlFor="fjNum">VA Number </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="fjNum"
                                  value={rmstoData.sto_va_number_rmsto}
                                  readOnly
                                />
                              </CCol>
                              <CCol md={2}>
                                <CFormLabel htmlFor="fjNum">MIGO Number </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="fjNum"
                                  value={rmstoData.sto_migo_number_rmsto}
                                  readOnly
                                />
                              </CCol>

                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="dCons">Diesel Cons. Qty Ltr</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  type="text"
                                  onChange={(e) => {
                                    changeRmstoTableItemForDCC(
                                      e,
                                      'diesel_cons_qty_ltr',
                                      index,
                                      parseFloat(arplDieselInfo.toFixed(2))
                                    )
                                  }}
                                  value={rmstoDataUpdateForDCC(
                                    rmstoData.diesel_cons_qty_ltr,
                                    rmstoData.diesel_cons_qty_ltr_input
                                  )}
                                  maxLength={6}
                                />
                                {rmstoData.diesel_cons_qty_ltr_validated === false && (
                                  <span className="small text-danger">Required</span>
                                )}
                              </CCol>
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="aLtr">Average Rate/Liter</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  type=""
                                  id="aLtr"
                                  value={parseFloat(arplDieselInfo.toFixed(2))}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="tdAmt">Total Diesel Amount</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="tdAmt"
                                  value={rmstoDataUpdateForDCC(
                                    rmstoData.diesel_amount,
                                    rmstoData.diesel_amount_input
                                  )}
                                  readOnly
                                />
                              </CCol>

                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="openKM">Opening KM</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  type="text"
                                  onChange={(e) => {
                                    changeRmstoTableItemForDCC(e, 'opening_km', index)
                                  }}
                                  value={rmstoDataUpdateForDCC(
                                    rmstoData.opening_km,
                                    rmstoData.opening_km_input
                                  )}
                                  maxLength={6}
                                />
                                {rmstoData.opening_km_validated === false && (
                                  <span className="small text-danger">Required</span>
                                )}
                              </CCol>
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="closeKM">Closing KM</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  type="text"
                                  onChange={(e) => {
                                    changeRmstoTableItemForDCC(e, 'closing_km', index)
                                  }}
                                  value={rmstoDataUpdateForDCC(
                                    rmstoData.closing_km,
                                    rmstoData.closing_km_input
                                  )}
                                  maxLength={6}
                                />
                                {rmstoData.closing_km_validated === false && (
                                  <span className="small text-danger">Required</span>
                                )}
                              </CCol>
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="runKM">Running KM</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="runKM"
                                  value={rmstoDataUpdateForDCC(
                                    rmstoData.running_km,
                                    rmstoData.running_km_input
                                  )}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="loadTon">Load Tonnage in MTS</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="loadTon"
                                  value={rmstoData.sto_delivery_quantity_rmsto}
                                  readOnly
                                />
                              </CCol>
                            </CRow>
                          </>
                        )
                      }
                    })}

                    {stoTableDataFCI && stoTableDataFCI.length > 0 && (
                      <>
                        <CRow className="mt-2" hidden>
                          <CCol xs={12} md={3}>
                            <CFormLabel
                              htmlFor="inputAddress"
                              style={{
                                backgroundColor: '#4d3227',
                                color: 'white',
                              }}
                            >
                              FCI :
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        {stoTableDataFCI.map((fciData, index) => {
                          if (fciData.sto_po_number_fci != '') {
                            return (
                              <>
                                <CRow className="mt-2" key={`fciData${index}`}>
                                  <CCol md={2}>
                                    <CFormLabel htmlFor="fjNum">FCI Migo Number </CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      id="fjNum"
                                      value={fciData.sto_migo_number_fci}
                                      readOnly
                                    />
                                  </CCol>

                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="dCons">Diesel Cons. Qty Ltr</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="text"
                                      onChange={(e) => {
                                        changeFciTableItemForDCC(
                                          e,
                                          'diesel_cons_qty_ltr',
                                          index,
                                          parseFloat(arplDieselInfo.toFixed(2))
                                        )
                                      }}
                                      value={fciDataUpdateForDCC(
                                        fciData.diesel_cons_qty_ltr,
                                        fciData.diesel_cons_qty_ltr_input
                                      )}
                                      maxLength={6}
                                    />
                                    {fciData.diesel_cons_qty_ltr_validated === false && (
                                      <span className="small text-danger">Required</span>
                                    )}
                                  </CCol>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="aLtr">Average Rate/Liter</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type=""
                                      id="aLtr"
                                      value={parseFloat(arplDieselInfo.toFixed(2))}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="tdAmt">Total Diesel Amount</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      id="tdAmt"
                                      value={fciDataUpdateForDCC(
                                        fciData.diesel_amount,
                                        fciData.diesel_amount_input
                                      )}
                                      readOnly
                                    />
                                  </CCol>

                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="openKM">Opening KM</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="text"
                                      onChange={(e) => {
                                        changeFciTableItemForDCC(e, 'opening_km', index)
                                      }}
                                      value={fciDataUpdateForDCC(
                                        fciData.opening_km,
                                        fciData.opening_km_input
                                      )}
                                      maxLength={6}
                                    />
                                    {fciData.opening_km_validated === false && (
                                      <span className="small text-danger">Required</span>
                                    )}
                                  </CCol>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="closeKM">Closing KM</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="text"
                                      onChange={(e) => {
                                        changeFciTableItemForDCC(e, 'closing_km', index)
                                      }}
                                      value={fciDataUpdateForDCC(
                                        fciData.closing_km,
                                        fciData.closing_km_input
                                      )}
                                      maxLength={6}
                                    />
                                    {fciData.closing_km_validated === false && (
                                      <span className="small text-danger">Required</span>
                                    )}
                                  </CCol>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="runKM">Running KM</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      id="runKM"
                                      value={fciDataUpdateForDCC(
                                        fciData.running_km,
                                        fciData.running_km_input
                                      )}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="loadTon">Load Tonnage in MTS</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      id="loadTon"
                                      value={fciData.sto_delivery_quantity_fci}
                                      readOnly
                                    />
                                  </CCol>
                                </CRow>
                              </>
                            )
                          }
                        })}
                        <hr />
                      </>
                    )}

                    {/* ----------------------------------------------------------------------------*/}
                    {/* ============ Own Vehicle Diesel Indent Info Tab End ==================== */}
                  </CTabPane>
                  <CTabPane
                    role="tabpanel"
                    aria-labelledby="contact-tab"
                    visible={activeKey_2 === 6}
                  >
                    <CRow className="mt-2" hidden>
                      <CCol md={2}>
                        <CFormLabel htmlFor="snum">
                          Shipment Number{' '}
                          {errors.DriverName && (
                            <span className="small text-danger">{errors.DriverName}</span>
                          )}
                        </CFormLabel>
                        <CFormSelect
                          size="sm"
                          name="snum"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          value={setSelectedDeliveryNumber}
                          className={`${errors.DriverName && 'is-invalid'}`}
                          aria-label="Small select example"
                          id="snum"
                        >
                          <option value="">Select...</option>
                          <option value="1">11111</option>
                          <option value="2">22222</option>
                          <option value="3">33333</option>
                        </CFormSelect>
                      </CCol>
                      <CCol xs={12} md={2}>
                        <CFormLabel htmlFor="dnum">
                          Delivery Number{' '}
                          {errors.DriverName && (
                            <span className="small text-danger">{errors.DriverName}</span>
                          )}
                        </CFormLabel>
                        <CFormSelect
                          size="sm"
                          name="dnum"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          value={setSelectedDeliveryNumber}
                          className={`${errors.DriverName && 'is-invalid'}`}
                          aria-label="Small select example"
                          id="dnum"
                        >
                          <option value="">Select...</option>
                          <option value="1">11111</option>
                          <option value="2">22222</option>
                          <option value="3">33333</option>
                        </CFormSelect>
                      </CCol>

                      <CCol xs={12} md={2}>
                        <CFormLabel htmlFor="Return">
                          Return To{' '}
                          {errors.DriverName && (
                            <span className="small text-danger">{errors.DriverName}</span>
                          )}
                        </CFormLabel>
                        <CFormSelect
                          size="sm"
                          name="Return"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          value={values.DriverName}
                          className={`${errors.DriverName && 'is-invalid'}`}
                          aria-label="Small select example"
                          id="Return"
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
                        <CFormLabel htmlFor="returnqty">Return QTY in Tons</CFormLabel>

                        <CFormInput size="sm" type="" id="returnqty" readOnly />
                      </CCol>
                      <CCol xs={12} md={2}>
                        <CFormLabel htmlFor="rRate">Return Rate Per Ton</CFormLabel>

                        <CFormInput size="sm" id="rRate" type="" readOnly />
                      </CCol>
                      <CCol xs={12} md={2}>
                        <CFormLabel htmlFor="rFreight">Return Freight Amount</CFormLabel>

                        <CFormInput size="sm" id="rFreight" type="" />
                      </CCol>
                      <CCol xs={12} md={2}>
                        <CFormLabel htmlFor="dPOD">Diverted POD</CFormLabel>
                        <CFormInput type="file" name="dPOD" size="sm" id="dPOD" />

                        {/* <CFormInput size="sm" id="inputAddress" value=" " readOnly /> */}
                      </CCol>
                    </CRow>
                  </CTabPane>

                  {/* Gate Pass Start */}
                  {/* <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey_2 === 8}>
                  <CRow className="mt-2" hidden>
                    <CCol xs={12} md={2}>
                      <CFormLabel htmlFor="gPass">
                        Gate Pass Type{' '}
                        {errors.gPass && <span className="small text-danger">{errors.gPass}</span>}
                      </CFormLabel>
                      <CFormSelect
                        size="sm"
                        name="gPass"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                        value={values.gPass}
                        className={`${errors.gPass && 'is-invalid'}`}
                        aria-label="Small select example"
                        id="gPass"
                      >
                        <option value="">Select...</option>
                        <option value="1">Returnable</option>
                        <option value="2">Non Returnable</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={2}>
                      <CFormLabel htmlFor="gNum">
                        Gate Pass Number{' '}
                        {errors.gNum && <span className="small text-danger">{errors.gNum}</span>}
                      </CFormLabel>
                      <CFormSelect
                        size="sm"
                        name="gNum"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                        value={values.gNum}
                        className={`${errors.gNum && 'is-invalid'}`}
                        aria-label="Small select example"
                        id="gNum"
                      >
                        <option value="">Select...</option>
                        <option value="1">11111</option>
                        <option value="2">22222</option>
                        <option value="3">33333</option>
                      </CFormSelect>
                    </CCol>

                    <CCol xs={12} md={2}>
                      <CFormLabel htmlFor="floc">From Loacation</CFormLabel>

                      <CFormInput size="sm" type="" id="floc" readOnly />
                    </CCol>
                    <CCol xs={12} md={2}>
                      <CFormLabel htmlFor="tloc">To Location</CFormLabel>

                      <CFormInput size="sm" id="tloc" type="" readOnly />
                    </CCol>
                    <CCol xs={12} md={2}>
                      <CFormLabel htmlFor="famt">Freight Amount</CFormLabel>
                      <CFormInput size="sm" id="famt" type="" />
                    </CCol>
                    <CCol xs={12} md={2}>
                      <CFormLabel htmlFor="attach">Attachment</CFormLabel>
                      <CFormInput type="file" name="attach" size="sm" id="attach" />

                      {/* <CFormInput size="sm" id="inputAddress" value=" " readOnly /> */}
                  {/* </CCol>
                  </CRow>
                </CTabPane>  */}
                  {/* Gate Pass End */}

                  {/* Own Vehicles Expenses Capture Start */}
                  {vehicleTypeId === 21 && (
                    <CTabPane
                      role="tabpanel"
                      aria-labelledby="contact-tab"
                      visible={activeKey_2 === 3}
                    >
                      {/* <CCard className="mt-4">
                    <CContainer className="m-2">
                      <CustomTable
                        columns={expense_columns}
                        data={expensesData}
                        // fieldName={'Driver_Name'}
                        showSearchFilter={true}
                        // pending={pending}
                      />
                    </CContainer>
                  </CCard> */}
                      <CTable
                        caption="top"
                        hover
                        style={{ height: '130vh' }}
                        className="overflow-scroll"
                      >
                        <CTableCaption style={{ color: 'maroon' }}>Expenses</CTableCaption>

                        {/* ================== Expense Table Header Part Start ====================== */}
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

                            <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                              Expense Amount
                            </CTableHeaderCell>

                            <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                              Total Expense Amount
                            </CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        {/* ================== Expense Table Header Part End ======================= */}
                        {/* ================== Expense Table Body Part Start ======================= */}
                        <CTableBody>
                          {/* ================== Expense Toll Amount Start ======================= */}

                          {/* <CTableRow>
                            <CTableDataCell scope="row">
                              <b>1</b>
                            </CTableDataCell>
                            <CTableDataCell>Fast-Tag Toll Amount</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                size="sm"
                                id="expense_row_toll_amount_from_api"
                                name="expense_row_toll_amount_from_api"
                                value={fasttagAmount}
                                readOnly
                              />
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_toll_amount_from_api"
                                name="expense_row_total_toll_amount_from_api"
                                value={fasttagAmount}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>                          {/* <CTableRow>
                            <CTableDataCell scope="row">
                              <b>1</b>
                            </CTableDataCell>
                            <CTableDataCell>Fast-Tag Toll Amount</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                size="sm"
                                id="expense_row_toll_amount_from_api"
                                name="expense_row_toll_amount_from_api"
                                value={fasttagAmount}
                                readOnly
                              />
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_toll_amount_from_api"
                                name="expense_row_total_toll_amount_from_api"
                                value={fasttagAmount}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow> */}
                          {/* ================== Expense Toll Amount Part End ======================= */}
                          {/* ================== Expense Extra Toll Amount Start ======================= */}

                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>1</b>
                            </CTableDataCell>
                            <CTableDataCell>Toll Amount</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={`${errors.toll_amount && 'is-invalid'}`}
                                id="toll_amount"
                                name="toll_amount"
                                maxLength={5}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                required={errors.toll_amount ? true : false}
                                size="sm"
                                value={values.toll_amount}
                              />
                              {errors.toll_amount && (
                                <span className="small text-danger">{errors.toll_amount}</span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_toll_amount"
                                name="expense_row_total_toll_amount"
                                value={errors.toll_amount ? 0 : values.toll_amount}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Expense Extra Toll Amount Part End ======================= */}
                          {/* ================== Expense Bata Part Start ======================= */}

                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>2</b>
                            </CTableDataCell>
                            <CTableDataCell>Bata</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={`${errors.bata && 'is-invalid'}`}
                                id="bata"
                                name="bata"
                                maxLength={5}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                required={errors.bata ? true : false}
                                size="sm"
                                value={values.bata}
                              />
                              {errors.bata && (
                                <span className="small text-danger">{errors.bata}</span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_bata"
                                name="expense_row_total_bata"
                                value={errors.bata ? 0 : values.bata}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Expense Bata Part End ======================= */}
                          {/* ================== Municipal Charges Part Start ======================= */}

                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>3</b>
                            </CTableDataCell>
                            <CTableDataCell>Municipal Charges</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={`${errors.municipal_charges && 'is-invalid'}`}
                                id="municipal_charges"
                                name="municipal_charges"
                                maxLength={5}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                required={errors.municipal_charges ? true : false}
                                size="sm"
                                value={values.municipal_charges}
                              />
                              {errors.municipal_charges && (
                                <span className="small text-danger">
                                  {errors.municipal_charges}
                                </span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_municipal_charges"
                                name="expense_row_total_municipal_charges"
                                value={errors.municipal_charges ? 0 : values.municipal_charges}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Municipal Charges Part End ======================= */}
                          {/* ================== Registerd Diesel Amount Part Start ======================= */}

                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>4</b>
                            </CTableDataCell>
                            <CTableDataCell>Registered Diesel Amount</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                size="sm"
                                id="expense_row_total_registered_diesel"
                                name="expense_row_total_registered_diesel"
                                value={rvTotalValuesBP.rvTotalDieselAmount}
                                // value="5"
                                readOnly
                              />
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_registered_diesel"
                                name="expense_row_total_registered_diesel"
                                value={rvTotalValuesBP.rvTotalDieselAmount}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Registerd Diesel Amount Part End ======================= */}
                          {/* ================== Enroute Diesel Amount Part Start ======================= */}

                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>5</b>
                            </CTableDataCell>
                            <CTableDataCell>Enroute Diesel Amount</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                size="sm"
                                id="expense_row_total_enroute_diesel"
                                name="expense_row_total_enroute_diesel"
                                value={urvTotalAmountFinder}
                                readOnly
                              />
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_enroute_diesel"
                                name="expense_row_total_enroute_diesel"
                                value={urvTotalAmountFinder}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Enroute Diesel Part End ======================= */}
                          {/* ================== Port Entry Fee Part Start ======================= */}

                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>6</b>
                            </CTableDataCell>
                            <CTableDataCell>Port Entry Fee</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={`${errors.port_entry_fee && 'is-invalid'}`}
                                id="port_entry_fee"
                                name="port_entry_fee"
                                maxLength={5}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                required={errors.port_entry_fee ? true : false}
                                size="sm"
                                value={values.port_entry_fee}
                              />
                              {errors.port_entry_fee && (
                                <span className="small text-danger">{errors.port_entry_fee}</span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_port_entry"
                                name="expense_row_total_port_entry"
                                value={errors.port_entry_fee ? 0 : values.port_entry_fee}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Port Entry Fee Part End ======================= */}
                          {/* ================== Misc Charges Part Start ======================= */}

                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>7</b>
                            </CTableDataCell>
                            <CTableDataCell>Misc Charges</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={`${errors.misc_charges && 'is-invalid'}`}
                                id="misc_charges"
                                name="misc_charges"
                                maxLength={5}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                required={errors.misc_charges ? true : false}
                                size="sm"
                                value={values.misc_charges}
                              />
                              {errors.misc_charges && (
                                <span className="small text-danger">{errors.misc_charges}</span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_misc_charge"
                                name="expense_row_total_misc_charge"
                                value={errors.misc_charges ? 0 : values.misc_charges}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Misc Charges Part End ======================= */}
                          {/* ================== Fine Amount Part Start ======================= */}

                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>8</b>
                            </CTableDataCell>
                            <CTableDataCell>Fine Amount</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={`${errors.fine_amount && 'is-invalid'}`}
                                id="fine_amount"
                                name="fine_amount"
                                maxLength={5}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                required={errors.fine_amount ? true : false}
                                size="sm"
                                value={values.fine_amount}
                              />
                              {errors.fine_amount && (
                                <span className="small text-danger">{errors.fine_amount}</span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_fine_charge"
                                name="expense_row_total_fine_charge"
                                value={errors.fine_amount ? 0 : values.fine_amount}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Fine Amount Part End ======================= */}
                          {/* ================== Subdelivery Charges Part Start ======================= */}

                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>9</b>
                            </CTableDataCell>
                            <CTableDataCell>Subdelivery Charges</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={`${errors.sub_delivery_charges && 'is-invalid'}`}
                                id="sub_delivery_charges"
                                name="sub_delivery_charges"
                                maxLength={5}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                required={errors.sub_delivery_charges ? true : false}
                                size="sm"
                                value={values.sub_delivery_charges}
                              />
                              {errors.sub_delivery_charges && (
                                <span className="small text-danger">
                                  {errors.sub_delivery_charges}
                                </span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_subdelivery_charge"
                                name="expense_row_total_subdelivery_charge"
                                value={
                                  errors.sub_delivery_charges ? 0 : values.sub_delivery_charges
                                }
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Subdelivery Charges Part End ======================= */}
                          {/* ================== Maintenance Cost Part Start ======================= */}

                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>10</b>
                            </CTableDataCell>
                            <CTableDataCell>Maintenance Cost</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={`${errors.maintenance_cost && 'is-invalid'}`}
                                id="maintenance_cost"
                                name="maintenance_cost"
                                maxLength={5}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                required={errors.maintenance_cost ? true : false}
                                size="sm"
                                value={values.maintenance_cost}
                              />
                              {errors.maintenance_cost && (
                                <span className="small text-danger">{errors.maintenance_cost}</span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_maintenance_charge"
                                name="expense_row_total_maintenance_charge"
                                value={errors.maintenance_cost ? 0 : values.maintenance_cost}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Maintenance Cost Part End ======================= */}
                          {/* ================== Loading Charges Part Start ======================= */}

                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>11</b>
                            </CTableDataCell>
                            <CTableDataCell>Loading Charges</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={`${errors.loading_charges && 'is-invalid'}`}
                                id="loading_charges"
                                name="loading_charges"
                                maxLength={5}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                required={errors.loading_charges ? true : false}
                                size="sm"
                                value={values.loading_charges}
                              />
                              {errors.loading_charges && (
                                <span className="small text-danger">{errors.loading_charges}</span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_loading_charge"
                                name="expense_row_total_loading_charge"
                                value={errors.loading_charges ? 0 : values.loading_charges}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Loading Charges Part End ======================= */}
                          {/* ================== Unloading Charges Part Start ======================= */}

                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>12</b>
                            </CTableDataCell>
                            <CTableDataCell>Unloading Charges</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={`${errors.unloading_charges && 'is-invalid'}`}
                                id="unloading_charges"
                                name="unloading_charges"
                                maxLength={5}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                required={errors.unloading_charges ? true : false}
                                size="sm"
                                // values={values.unloading_charges}
                                // value={
                                //   ExpenseUnloadingCharges || settlementAvailable
                                //     ? values.unloading_charges
                                //     : ''
                                // }
                                value={
                                  ExpenseUnloadingCharges != 0
                                    ? ExpenseUnloadingCharges
                                    : values.unloading_charges
                                  // : settlementAvailable
                                  // ? values.unloading_charges
                                  // : 0
                                }
                              />
                              {errors.unloading_charges && (
                                <span className="small text-danger">
                                  {errors.unloading_charges}
                                </span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_unloading_charge"
                                name="expense_row_total_unloading_charge"
                                value={
                                  ExpenseUnloadingCharges != 0
                                    ? ExpenseUnloadingCharges
                                    : values.unloading_charges
                                  // : settlementAvailable
                                  // ? values.unloading_charges
                                  // : 0
                                }
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Unloading Charges Part End ======================= */}
                          {/* ================== Tarpaulin Charges Part Start ======================= */}

                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>13</b>
                            </CTableDataCell>
                            <CTableDataCell>Tarpaulin Charges</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={`${errors.tarpaulin_charges && 'is-invalid'}`}
                                id="tarpaulin_charges"
                                name="tarpaulin_charges"
                                maxLength={5}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                required={errors.tarpaulin_charges ? true : false}
                                size="sm"
                                value={values.tarpaulin_charges}
                              />
                              {errors.tarpaulin_charges && (
                                <span className="small text-danger">
                                  {errors.tarpaulin_charges}
                                </span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_tarpaulin_charge"
                                name="expense_row_total_tarpaulin_charge"
                                value={errors.tarpaulin_charges ? 0 : values.tarpaulin_charges}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Tarpaulin Charges Part End ======================= */}
                          {/* ================== Weighment Charges Part Start ======================= */}

                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>14</b>
                            </CTableDataCell>
                            <CTableDataCell>Weighment Charges</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={`${errors.weighment_charges && 'is-invalid'}`}
                                id="weighment_charges"
                                name="weighment_charges"
                                maxLength={5}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                required={errors.weighment_charges ? true : false}
                                size="sm"
                                value={values.weighment_charges}
                              />
                              {errors.weighment_charges && (
                                <span className="small text-danger">
                                  {errors.weighment_charges}
                                </span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_weighment_charge"
                                name="expense_row_total_weighment_charge"
                                value={errors.weighment_charges ? 0 : values.weighment_charges}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Weighment Charges Part End ======================= */}
                          {/* ================== Low Tonage Charges Part Start ======================= */}

                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>15</b>
                            </CTableDataCell>
                            <CTableDataCell>Low Tonage Charges</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={`${errors.low_tonage_charges && 'is-invalid'}`}
                                id="low_tonage_charges"
                                name="low_tonage_charges"
                                maxLength={5}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                required={errors.low_tonage_charges ? true : false}
                                size="sm"
                                value={values.low_tonage_charges}
                              />
                              {errors.low_tonage_charges && (
                                <span className="small text-danger">
                                  {errors.low_tonage_charges}
                                </span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_low_tonage_charge"
                                name="expense_row_total_low_tonage_charge"
                                value={errors.low_tonage_charges ? 0 : values.low_tonage_charges}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Low Tonage Charges Part End ======================= */}
                          {/* ================== Stock Diversion / Return Charges Part Start ============ */}

                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>16</b>
                            </CTableDataCell>
                            <CTableDataCell>Stock Diversion / Return Charges</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={`${errors.diversion_return_charges && 'is-invalid'}`}
                                id="diversion_return_charges"
                                name="diversion_return_charges"
                                maxLength={5}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                required={errors.diversion_return_charges ? true : false}
                                size="sm"
                                value={values.diversion_return_charges}
                              />
                              {errors.diversion_return_charges && (
                                <span className="small text-danger">
                                  {errors.diversion_return_charges}
                                </span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_stock_return_charge"
                                name="expense_row_total_stock_return_charge"
                                value={
                                  errors.diversion_return_charges
                                    ? 0
                                    : values.diversion_return_charges
                                }
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Stock Diversion / Return Charges Part End ========== */}
                          {/* ================== Halt Bata Part End ======================= */}
                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>17</b>
                            </CTableDataCell>
                            <CTableDataCell>Halt Bata</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={`${errors.halt_bata_amount && 'is-invalid'}`}
                                id="halt_bata_amount"
                                name="halt_bata_amount"
                                maxLength={5}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                required={errors.halt_bata_amount ? true : false}
                                size="sm"
                                value={values.halt_bata_amount}
                              />
                              {errors.halt_bata_amount && (
                                <span className="small text-danger">{errors.halt_bata_amount}</span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_halt_bata_amount"
                                name="expense_row_total_halt_bata_amount"
                                value={errors.halt_bata_amount ? 0 : values.halt_bata_amount}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Halt Bata Part End ======================= */}
                          {/* ================== Local Bata Part End ======================= */}
                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>18</b>
                            </CTableDataCell>
                            <CTableDataCell>Local Bata</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                className={`${errors.local_bata_amount && 'is-invalid'}`}
                                id="local_bata_amount"
                                name="local_bata_amount"
                                maxLength={5}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                required={errors.local_bata_amount ? true : false}
                                size="sm"
                                value={values.local_bata_amount}
                              />
                              {errors.local_bata_amount && (
                                <span className="small text-danger">
                                  {errors.local_bata_amount}
                                </span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_local_bata_amount_amount"
                                name="expense_row_total_local_bata_amount_amount"
                                value={errors.local_bata_amount ? 0 : values.local_bata_amount}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Local Bata Part End ======================= */}

                          {tripInfo &&
                            tripInfo.trip_vehicle_info &&
                            tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id &&
                            tripInfo.tripsheet_info.trip_vehicle_info.vehicle_type_id === 1 &&
                            tripInfo.rj_so_info &&
                            tripInfo.rj_so_info.length > 0 && (
                              <>
                                {/* ==================== RJSO Additional Expenses Part Start ==================== */}
                                {/* ================== Bata Part End ======================= */}
                                <CTableRow>
                                  <CTableDataCell scope="row">
                                    <b>19</b>
                                  </CTableDataCell>
                                  <CTableDataCell>RJ Bata</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      className={`${errors.rjso_bata_amount && 'is-invalid'}`}
                                      id="rjso_bata_amount"
                                      name="rjso_bata_amount"
                                      maxLength={5}
                                      onFocus={onFocus}
                                      onBlur={onBlur}
                                      onChange={handleChange}
                                      required={errors.rjso_bata_amount ? true : false}
                                      size="sm"
                                      value={values.rjso_bata_amount}
                                    />
                                    {errors.rjso_bata_amount && (
                                      <span className="small text-danger">
                                        {errors.rjso_bata_amount}
                                      </span>
                                    )}
                                  </CTableDataCell>
                                  <CTableDataCell scope="row">
                                    <CFormInput
                                      size="sm"
                                      id="expense_row_total_rjso_bata_amount"
                                      name="expense_row_total_rjso_bata_amount"
                                      value={errors.rjso_bata_amount ? 0 : values.rjso_bata_amount}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </CTableRow>
                                {/* ================== Bata Part End ======================= */}
                                {/* ================== Loading Amount Part End ======================= */}
                                <CTableRow>
                                  <CTableDataCell scope="row">
                                    <b>20</b>
                                  </CTableDataCell>
                                  <CTableDataCell>RJ Loading Charges</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      className={`${errors.rjso_loading_charges && 'is-invalid'}`}
                                      id="rjso_loading_charges"
                                      name="rjso_loading_charges"
                                      maxLength={5}
                                      onFocus={onFocus}
                                      onBlur={onBlur}
                                      onChange={handleChange}
                                      required={errors.rjso_loading_charges ? true : false}
                                      size="sm"
                                      value={values.rjso_loading_charges}
                                    />
                                    {errors.rjso_loading_charges && (
                                      <span className="small text-danger">
                                        {errors.rjso_loading_charges}
                                      </span>
                                    )}
                                  </CTableDataCell>
                                  <CTableDataCell scope="row">
                                    <CFormInput
                                      size="sm"
                                      id="expense_row_total_rjso_loading_charges"
                                      name="expense_row_total_rjso_loading_charges"
                                      value={
                                        errors.rjso_loading_charges
                                          ? 0
                                          : values.rjso_loading_charges
                                      }
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </CTableRow>
                                {/* ================== Loading Amount Part End ======================= */}
                                {/* ================== Un Loading Amount Part End ======================= */}
                                <CTableRow>
                                  <CTableDataCell scope="row">
                                    <b>21</b>
                                  </CTableDataCell>
                                  <CTableDataCell>RJ Unloading Charges</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      className={`${errors.rjso_unloading_charges && 'is-invalid'}`}
                                      id="rjso_unloading_charges"
                                      name="rjso_unloading_charges"
                                      maxLength={5}
                                      onFocus={onFocus}
                                      onBlur={onBlur}
                                      onChange={handleChange}
                                      required={errors.rjso_unloading_charges ? true : false}
                                      size="sm"
                                      value={values.rjso_unloading_charges}
                                    />
                                    {errors.rjso_unloading_charges && (
                                      <span className="small text-danger">
                                        {errors.rjso_unloading_charges}
                                      </span>
                                    )}
                                  </CTableDataCell>
                                  <CTableDataCell scope="row">
                                    <CFormInput
                                      size="sm"
                                      id="expense_row_total_rjso_unloading_charges"
                                      name="expense_row_total_rjso_unloading_charges"
                                      value={
                                        errors.rjso_unloading_charges
                                          ? 0
                                          : values.rjso_unloading_charges
                                      }
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </CTableRow>
                                {/* ================== Un Loading Amount Part End ======================= */}
                                {/* ================== Commision Amount Part End ======================= */}
                                <CTableRow>
                                  <CTableDataCell scope="row">
                                    <b>22</b>
                                  </CTableDataCell>
                                  <CTableDataCell>RJ Commision Charges</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      className={`${errors.rjso_commision_charges && 'is-invalid'}`}
                                      id="rjso_commision_charges"
                                      name="rjso_commision_charges"
                                      maxLength={5}
                                      onFocus={onFocus}
                                      onBlur={onBlur}
                                      onChange={handleChange}
                                      required={errors.rjso_commision_charges ? true : false}
                                      size="sm"
                                      value={values.rjso_commision_charges}
                                    />
                                    {errors.rjso_commision_charges && (
                                      <span className="small text-danger">
                                        {errors.rjso_commision_charges}
                                      </span>
                                    )}
                                  </CTableDataCell>
                                  <CTableDataCell scope="row">
                                    <CFormInput
                                      size="sm"
                                      id="expense_row_total_rjso_commision_charges"
                                      name="expense_row_total_rjso_commision_charges"
                                      value={
                                        errors.rjso_commision_charges
                                          ? 0
                                          : values.rjso_commision_charges
                                      }
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </CTableRow>
                                {/* ================== Commision Amount Part End ======================= */}
                                {/* ================== Tarpaulin Amount Part End ======================= */}
                                <CTableRow>
                                  <CTableDataCell scope="row">
                                    <b>23</b>
                                  </CTableDataCell>
                                  <CTableDataCell>RJ Tarpaulin Charges</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      className={`${errors.rjso_tarpaulin_charges && 'is-invalid'}`}
                                      id="rjso_tarpaulin_charges"
                                      name="rjso_tarpaulin_charges"
                                      maxLength={5}
                                      onFocus={onFocus}
                                      onBlur={onBlur}
                                      onChange={handleChange}
                                      required={errors.rjso_tarpaulin_charges ? true : false}
                                      size="sm"
                                      value={values.rjso_tarpaulin_charges}
                                    />
                                    {errors.rjso_tarpaulin_charges && (
                                      <span className="small text-danger">
                                        {errors.rjso_tarpaulin_charges}
                                      </span>
                                    )}
                                  </CTableDataCell>
                                  <CTableDataCell scope="row">
                                    <CFormInput
                                      size="sm"
                                      id="expense_row_total_rjso_tarpaulin_charges"
                                      name="expense_row_total_rjso_tarpaulin_charges"
                                      value={
                                        errors.rjso_tarpaulin_charges
                                          ? 0
                                          : values.rjso_tarpaulin_charges
                                      }
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </CTableRow>
                                {/* ================== Tarpaulin Amount Part End ======================= */}
                                {/* ================== Weighment Amount Part End ======================= */}
                                <CTableRow>
                                  <CTableDataCell scope="row">
                                    <b>24</b>
                                  </CTableDataCell>
                                  <CTableDataCell>RJ Weighment Charges</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      className={`${errors.rjso_weighment_charges && 'is-invalid'}`}
                                      id="rjso_weighment_charges"
                                      name="rjso_weighment_charges"
                                      maxLength={5}
                                      onFocus={onFocus}
                                      onBlur={onBlur}
                                      onChange={handleChange}
                                      required={errors.rjso_weighment_charges ? true : false}
                                      size="sm"
                                      value={values.rjso_weighment_charges}
                                    />
                                    {errors.rjso_weighment_charges && (
                                      <span className="small text-danger">
                                        {errors.rjso_weighment_charges}
                                      </span>
                                    )}
                                  </CTableDataCell>
                                  <CTableDataCell scope="row">
                                    <CFormInput
                                      size="sm"
                                      id="expense_row_total_rjso_weighment_charges"
                                      name="expense_row_total_rjso_weighment_charges"
                                      value={
                                        errors.rjso_weighment_charges
                                          ? 0
                                          : values.rjso_weighment_charges
                                      }
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </CTableRow>
                                {/* ================== Weighment Amount Part End ======================= */}
                                {/* ================== Misc. Amount Part End ======================= */}
                                <CTableRow>
                                  <CTableDataCell scope="row">
                                    <b>25</b>
                                  </CTableDataCell>
                                  <CTableDataCell>RJ Misc. Charges</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      className={`${errors.rjso_misc_charges && 'is-invalid'}`}
                                      id="rjso_misc_charges"
                                      name="rjso_misc_charges"
                                      maxLength={5}
                                      onFocus={onFocus}
                                      onBlur={onBlur}
                                      onChange={handleChange}
                                      required={errors.rjso_misc_charges ? true : false}
                                      size="sm"
                                      value={values.rjso_misc_charges}
                                    />
                                    {errors.rjso_misc_charges && (
                                      <span className="small text-danger">
                                        {errors.rjso_misc_charges}
                                      </span>
                                    )}
                                  </CTableDataCell>
                                  <CTableDataCell scope="row">
                                    <CFormInput
                                      size="sm"
                                      id="expense_row_total_rjso_misc_charges"
                                      name="expense_row_total_rjso_misc_charges"
                                      value={
                                        errors.rjso_misc_charges ? 0 : values.rjso_misc_charges
                                      }
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </CTableRow>
                                {/* ================== Misc. Amount Part End ======================= */}
                                {/* ================== Municipal Amount Part End ======================= */}
                                <CTableRow>
                                  <CTableDataCell scope="row">
                                    <b>26</b>
                                  </CTableDataCell>
                                  <CTableDataCell>RJ Municipal Charges</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      className={`${errors.rjso_munic_charges && 'is-invalid'}`}
                                      id="rjso_munic_charges"
                                      name="rjso_munic_charges"
                                      maxLength={5}
                                      onFocus={onFocus}
                                      onBlur={onBlur}
                                      onChange={handleChange}
                                      required={errors.rjso_munic_charges ? true : false}
                                      size="sm"
                                      value={values.rjso_munic_charges}
                                    />
                                    {errors.rjso_munic_charges && (
                                      <span className="small text-danger">
                                        {errors.rjso_munic_charges}
                                      </span>
                                    )}
                                  </CTableDataCell>
                                  <CTableDataCell scope="row">
                                    <CFormInput
                                      size="sm"
                                      id="expense_row_total_rjso_munic_charges"
                                      name="expense_row_total_rjso_munic_charges"
                                      value={
                                        errors.rjso_munic_charges ? 0 : values.rjso_munic_charges
                                      }
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </CTableRow>
                                {/* ================== Municipal Amount Part End ======================= */}
                                {/* ================== Halting Amount Part End ======================= */}
                                <CTableRow>
                                  <CTableDataCell scope="row">
                                    <b>27</b>
                                  </CTableDataCell>
                                  <CTableDataCell>RJ Halt Charges</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      className={`${errors.rjso_halt_charges && 'is-invalid'}`}
                                      id="rjso_halt_charges"
                                      name="rjso_halt_charges"
                                      maxLength={5}
                                      onFocus={onFocus}
                                      onBlur={onBlur}
                                      onChange={handleChange}
                                      required={errors.rjso_halt_charges ? true : false}
                                      size="sm"
                                      value={values.rjso_halt_charges}
                                    />
                                    {errors.rjso_halt_charges && (
                                      <span className="small text-danger">
                                        {errors.rjso_halt_charges}
                                      </span>
                                    )}
                                  </CTableDataCell>
                                  <CTableDataCell scope="row">
                                    <CFormInput
                                      size="sm"
                                      id="expense_row_total_rjso_halt_charges"
                                      name="expense_row_total_rjso_halt_charges"
                                      value={
                                        errors.rjso_halt_charges ? 0 : values.rjso_halt_charges
                                      }
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </CTableRow>
                                {/* ================== Halting Amount Part End ======================= */}
                                {/* ================== Enrote Diesel Amount Part End ======================= */}
                                <CTableRow>
                                  <CTableDataCell scope="row">
                                    <b>28</b>
                                  </CTableDataCell>
                                  <CTableDataCell>RJ Enroute Diesel Charges</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      className={`${errors.rjso_en_diesel_charges && 'is-invalid'}`}
                                      id="rjso_en_diesel_charges"
                                      name="rjso_en_diesel_charges"
                                      maxLength={5}
                                      onFocus={onFocus}
                                      onBlur={onBlur}
                                      onChange={handleChange}
                                      required={errors.rjso_en_diesel_charges ? true : false}
                                      size="sm"
                                      value={values.rjso_en_diesel_charges}
                                    />
                                    {errors.rjso_en_diesel_charges && (
                                      <span className="small text-danger">
                                        {errors.rjso_en_diesel_charges}
                                      </span>
                                    )}
                                  </CTableDataCell>
                                  <CTableDataCell scope="row">
                                    <CFormInput
                                      size="sm"
                                      id="expense_row_total_rjso_en_diesel_charges"
                                      name="expense_row_total_rjso_en_diesel_charges"
                                      value={
                                        errors.rjso_en_diesel_charges
                                          ? 0
                                          : values.rjso_en_diesel_charges
                                      }
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </CTableRow>
                                {/* ================== Enrote Diesel Amount Part End ======================= */}
                                {/* ==================== RJSO Additional Expenses Part End ==================== */}
                              </>
                            )}

                          {/* ==================== FCI Expenses Part Start ==================== */}

                          {/* ==================== FCI Expenses Part End ==================== */}

                          {/* ================== Total Charges Part Start ============ */}

                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>*</b>
                            </CTableDataCell>
                            <CTableDataCell>Total Trip Expense Charges</CTableDataCell>
                            <CTableDataCell> </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_total_total_charge"
                                name="expense_row_total_total_charge"
                                value={totalChargesOwn ? totalChargesOwn : 0}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                          {/* ================== Total Charges Part End ========== */}
                        </CTableBody>
                        {/* ================== Expense Table Body Part Start ======================= */}
                      </CTable>

                      <CTable caption="top" hover style={{ height: '20vh' }}>
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

                            <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                              Total Days
                            </CTableHeaderCell>
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
                                maxLength={2}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={handleChange}
                                required={errors.halt_days ? true : false}
                                size="sm"
                                value={values.halt_days}
                              />
                              {errors.halt_days && (
                                <span className="small text-danger">{errors.halt_days}</span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell scope="row">
                              <CFormInput
                                size="sm"
                                id="expense_row_halt_days"
                                name="expense_row_halt_days"
                                value={errors.halt_days ? 0 : values.halt_days}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>

                          {/* ================== Others Halt Days Part End ======================= */}
                        </CTableBody>
                        {/* ================== Expense Table Body Part End ======================= */}
                      </CTable>
                      <CRow className="mt-2">
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                          <CFormTextarea
                            name="remarks"
                            id="remarks"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={handleChange}
                            rows="1"
                            value={values.remarks}
                          ></CFormTextarea>
                        </CCol>
                        {fasttagAmount != 0 && (
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="toll_posting_date">
                              Fast-Tag Toll Posting Date <REQ />{' '}
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="date"
                              id="toll_posting_date"
                              name="toll_posting_date"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                              min={Expense_Income_Posting_Date.min_date}
                              max={Expense_Income_Posting_Date.max_date}
                              onKeyDown={(e) => {
                                e.preventDefault()
                              }}
                              value={values.toll_posting_date}
                            />
                          </CCol>
                        )}
                      </CRow>

                      <CRow>
                        {/* {tripInfo && tripInfo.tic_parent_info && tripInfo.tic_parent_info.status == '6' && (*/}

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
                              TripsheetClosureSubmit(settlementAvailable ? 'update' : 'submit')
                            }}
                            type="Submit"
                          >
                            {settlementAvailable ? 'Update' : 'Submit'}
                          </CButton>
                        </CCol>
                        {/* )
                      } */}
                      </CRow>
                    </CTabPane>
                  )}
                  {/* Own Vehicles Expenses Capture End */}
                  <CTabPane
                    role="tabpanel"
                    aria-labelledby="profile-tab"
                    visible={activeKey_2 === 7}
                  >
                    <CTable caption="top" hover>
                      <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                        <CTableRow>
                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            S.No
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Type
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            FJ Delivery
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            RJ Delivery
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            STO Delivery
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Total
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        <CTableRow>
                          <CTableHeaderCell scope="row">1</CTableHeaderCell>
                          <CTableDataCell>Advance Amount</CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type=""
                              name="divortedPod"
                              size="sm"
                              id="formFileSm"
                              readOnly
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type=""
                              name="divortedPod"
                              size="sm"
                              id="formFileSm"
                              readOnly
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type=""
                              name="divortedPod"
                              size="sm"
                              id="formFileSm"
                              readOnly
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type=""
                              name="divortedPod"
                              size="sm"
                              id="formFileSm"
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">2</CTableHeaderCell>
                          <CTableDataCell>RJ Recipt Amount</CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type=""
                              name="divortedPod"
                              size="sm"
                              id="formFileSm"
                              readOnly
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type=""
                              name="divortedPod"
                              size="sm"
                              id="formFileSm"
                              readOnly
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type=""
                              name="divortedPod"
                              size="sm"
                              id="formFileSm"
                              readOnly
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type=""
                              name="divortedPod"
                              size="sm"
                              id="formFileSm"
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">3</CTableHeaderCell>
                          <CTableDataCell>Total Amount</CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type=""
                              name="divortedPod"
                              size="sm"
                              id="formFileSm"
                              readOnly
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type=""
                              name="divortedPod"
                              size="sm"
                              id="formFileSm"
                              readOnly
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type=""
                              name="divortedPod"
                              size="sm"
                              id="formFileSm"
                              readOnly
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type=""
                              name="divortedPod"
                              size="sm"
                              id="formFileSm"
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">4</CTableHeaderCell>
                          <CTableDataCell>Balance</CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type=""
                              name="divortedPod"
                              size="sm"
                              id="formFileSm"
                              readOnly
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type=""
                              name="divortedPod"
                              size="sm"
                              id="formFileSm"
                              readOnly
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type=""
                              name="divortedPod"
                              size="sm"
                              id="formFileSm"
                              readOnly
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type=""
                              name="divortedPod"
                              size="sm"
                              id="formFileSm"
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                    <CRow className="mt-2">
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                        <CFormTextarea
                          // name="remarks"
                          id="remarks"
                          rows="1"
                          // values={values.remarks}
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
                        style={{ display: 'flex', flexDirection: 'row-reverse', cursor: 'pointer' }}
                      >
                        <CButton
                          size="sm"
                          color="warning"
                          disabled={enableSubmit}
                          className="mx-3 text-white"
                          // className="align-self-end ml-auto"
                          type="submit"
                        >
                          Close Tripsheet
                        </CButton>
                      </CCol>
                    </CRow>
                  </CTabPane>
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
                {tripInfo.trip_vehicle_info &&
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
                {tripInfo.trip_vehicle_info &&
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
            {/*Camera Image Copy model*/}
            <CModal
              visible={deliveryDelete}
              backdrop="static"
              // scrollable
              onClose={() => {
                setDeliveryDelete(false)
              }}
            >
              <CModalBody>
                <p className="lead">
                  Are you sure to delete the Delivery Order - {deliveryNoDelete} ?
                </p>
              </CModalBody>
              <CModalFooter>
                <CButton
                  className="m-2"
                  color="warning"
                  onClick={() => {
                    setDeliveryDelete(false)
                    removeStoFields(deliveryNoDeleteIndex)
                  }}
                >
                  Confirm
                </CButton>
                <CButton
                  color="secondary"
                  onClick={() => {
                    setDeliveryDelete(false)
                  }}
                >
                  Cancel
                </CButton>
                {/* <CButton color="primary">Save changes</CButton> */}
              </CModalFooter>
            </CModal>
            <CModal
              visible={deliveryOthersDelete}
              backdrop="static"
              // scrollable
              onClose={() => {
                setDeliveryOthersDelete(false)
              }}
            >
              <CModalBody>
                <p className="lead">
                  Are you sure to delete the Delivery Order - {deliveryNoOthersDelete} ?
                </p>
              </CModalBody>
              <CModalFooter>
                <CButton
                  className="m-2"
                  color="warning"
                  onClick={() => {
                    setDeliveryOthersDelete(false)
                    removeOthersStoFields(deliveryNoOthersDeleteIndex)
                  }}
                >
                  Confirm
                </CButton>
                <CButton
                  color="secondary"
                  onClick={() => {
                    setDeliveryOthersDelete(false)
                  }}
                >
                  Cancel
                </CButton>
                {/* <CButton color="primary">Save changes</CButton> */}
              </CModalFooter>
            </CModal>
            {/* ======================= RMSTO Confirm Delete Button Modal Area ========================== */}
            <CModal
              visible={deliveryDeleteRMSTO}
              backdrop="static"
              // scrollable
              onClose={() => {
                setDeliveryDeleteRMSTO(false)
              }}
            >
              <CModalBody>
                <p className="lead">
                  Are you sure to delete the Delivery Order - {deliveryNoDeleteRMSTO} ?
                </p>
              </CModalBody>
              <CModalFooter>
                <CButton
                  className="m-2"
                  color="warning"
                  onClick={() => {
                    setDeliveryDeleteRMSTO(false)
                    removeStoFieldsRMSTO(deliveryNoDeleteIndexRMSTO)
                  }}
                >
                  Confirm
                </CButton>
                <CButton
                  color="secondary"
                  onClick={() => {
                    setDeliveryDeleteRMSTO(false)
                  }}
                >
                  Cancel
                </CButton>
                {/* <CButton color="primary">Save changes</CButton> */}
              </CModalFooter>
            </CModal>
            {/* *********************************************************** */}
          </CCard>
        </>
      )}
    </>
  )
}

export default NlmtSettlementClosure
