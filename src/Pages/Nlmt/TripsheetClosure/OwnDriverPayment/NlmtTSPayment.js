/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCol,
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
  CTableRow,
  CFormTextarea,
  CCardImage,
  CAlert,
} from '@coreui/react'
import { React, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import Loader from 'src/components/Loader'

import * as TripsheetClosureConstants from 'src/components/constants/TripsheetClosureConstants'
import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'
import DieselVendorMasterService from 'src/Service/Master/DieselVendorMasterService'

import StoTableComponent from '../StoTableComponent'
import AllDriverListNameSelectComponent from 'src/components/commoncomponent/AllDriverListNameSelectComponent'
import StoTableRMSTOComponent from '../StoTableRMSTOComponent'
import CustomTable from 'src/components/customComponent/CustomTable'
import ExpenseCalculations from '../Calculations/NlmtExpenseCalculations'
import TripsheetClosureValidation from 'src/Utils/TripsheetClosure/TripsheetClosureValidation'
import useFormRJSO from 'src/Hooks/useFormRJSO'
import useFormTripsheetClosure from 'src/Hooks/useFormTripsheetClosure'
import StoDeliverDataService from 'src/Service/SAP/StoDeliveryDataService'
import StoDeliveryDataService from 'src/Service/SAP/StoDeliveryDataService'
import RJSaleOrderCreationService from 'src/Service/RJSaleOrderCreation/RJSaleOrderCreationService'
import VehicleMasterService from 'src/Service/Master/VehicleMasterService'

import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import { checkPropTypes, number } from 'prop-types'
// import { prototype } from 'simplebar-react'
import PropTypes from 'prop-types'
import CustomerCreationService from 'src/Service/CustomerCreation/CustomerCreationService'
import TripSheetClosureSapService from 'src/Service/SAP/TripSheetClosureSapService'
import ExpenseIncomePostingDate from '../Calculations/NlmtExpenseIncomePostingDate'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as NlmtScreenAccessCodes from 'src/components/constants/NlmtScreenAccessCodes'
import CustomerFreightApi from 'src/Service/SubMaster/CustomerFreightApi'
import Swal from 'sweetalert2'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import ParkingYardGateService from 'src/Service/ParkingYardGate/ParkingYardGateService'
import VehicleVarietyService from 'src/Service/SmallMaster/Vehicles/VehicleVarietyService'
import VehicleRequestMasterService from 'src/Service/VehicleRequest/VehicleRequestMasterService'
import VehicleCapacityService from 'src/Service/SmallMaster/Vehicles/VehicleCapacityService'
import VehicleBodyTypeService from 'src/Service/SmallMaster/Vehicles/VehicleBodyTypeService'
import DivisionApi from 'src/Service/SubMaster/DivisionApi'
import DepartmentApi from 'src/Service/SubMaster/DepartmentApi'
import SmallLoader from 'src/components/SmallLoader'
import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'
import PanDataService from 'src/Service/SAP/PanDataService'
import NlmtTripSheetClosureService from 'src/Service/Nlmt/TripSheetClosure/NlmtTripSheetClosureService'
import NlmtRMSTOJourneyInfo from '../JourneyInfo/NlmtRMSTOJourneyInfo'
import NlmtRakeJourneyInfo from '../JourneyInfo/NlmtRakeJourneyInfo'
import NlmtOthersJourneyInfo from '../JourneyInfo/NlmtOthersJourneyInfo'
// import NlmtFGSALESJourneyInfo from './JourneyInfo/NlmtFGSALESJourneyInfo'
import NlmtFCIJourneyInfo from '../JourneyInfo/NlmtFCIJourneyInfo'
import NlmtRJSaleOrderCreationService from 'src/Service/Nlmt/RJSaleOrderCreation/NlmtRJSaleOrderCreationService'
import NlmtVehicleAssignmentService from 'src/Service/Nlmt/VehicleAssignment/NlmtVehicleAssignmentService'
import NlmtDefinitionsListApi from 'src/Service/Nlmt/Masters/NlmtDefinitionsListApi'
import NlmtTripSheetClosureSapService from 'src/Service/Nlmt/SAP/NlmtTripSheetClosureSapService'
import NlmtFGSALESJourneyInfo from '../JourneyInfo/NlmtFGSALESJourneyInfo'

export const nlmt_expense_vendor_code = process.env.REACT_APP_NLMT_EXPENSE_VENDOR
export const nlfs_income_vendor_code = process.env.REACT_APP_NLMT_INCOME_VENDOR

const NlmtTSPayment = () => {
  /*================== User Id & Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []
  const navigation = useNavigate()

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  const Expense_Income_Posting_Date = ExpenseIncomePostingDate()
  console.log(Expense_Income_Posting_Date, 'ExpenseIncomePostingDate')

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/

  /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  const [restrictScreenById, setRestrictScreenById] = useState(true)
  let page_no = NlmtScreenAccessCodes.NlmtClosureScreens.NLMT_Own_Driver_Payment_Approval

  useEffect(() => {

    if (user_info.is_admin == 1 || JavascriptInArrayComponent(page_no, user_info.page_permissions)) {
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else {
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

  }, [])
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
    low_tonage_charges: '',
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
    toll_charges: '',
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
    income_remarks: '',
    settled_by: '',
    driver_balance_received: '',
    expense_posting_date: '',
    income_posting_date: '',
    income_sap_text: '',
    HSNtax: '',
  }

  const [vpan, setVpan] = useState('')
  const [vpanMobile, setVpanMobile] = useState(0)
  const [vpanMobileHaving, setVpanMobileHaving] = useState(false)

  const [locationData, setLocationData] = useState([])
  useEffect(() => {
    //section for getting Location Data from database
    LocationApi.getLocation().then((res) => {
      console.log(res.data.data, 'location data')
      setLocationData(res.data.data)
    })
  }, [])

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



  const dateCheck = (dateFrom, dateTo, dateCheck) => {
    console.log(dateFrom, 'dateFrom')
    console.log(dateTo, 'dateTo')
    console.log(dateCheck, 'dateCheck')

    var d1 = dateFrom.split('-')
    var d2 = dateTo.split('-')
    var c = dateCheck.split('-')

    var from = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]) // -1 because months are from 0 to 11
    var to = new Date(d2[2], parseInt(d2[1]) - 1, d2[0])
    var check = new Date(c[2], parseInt(c[1]) - 1, c[0])
    console.log(check >= from && check <= to, 'condition')
    if (check >= from && check <= to) {
      return true
    } else {
      return false
    }
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
  } = useFormTripsheetClosure(login, TripsheetClosureValidation, formValues)

  function login() {
    // alert('No Errors CallBack Called')
  }

  const { id } = useParams()
  const [fetch, setFetch] = useState(false)
  const [smallFetch, setSmallFetch] = useState(false)
  const [stoDeliveryEdit, setStoDeliveryEdit] = useState(false)
  const [baseFreightNull, setBaseFreightNull] = useState(false)
  const [driverExpenseSapDocumentNo, setDriverExpenseSapDocumentNo] = useState(0)
  const [rjExpenseSapDocumentNo, setRjExpenseSapDocumentNo] = useState(0)

  const [freight_balance_amount, setFreight_balance_amount] = useState(0)
  const [freight_total_amount, setFreight_total_amount] = useState(0)
  const [advance_total_amount, setAdvance_total_amount] = useState(0)
  const [shipmentInfo, setShipmentInfo] = useState([])
  const [tripsettlementData, setTripsettlementData] = useState([])

  /* Overall Journey Information Constants */
  const [tripFgsalesData, setTripFgsalesData] = useState([])
  const [tripRjsoData, setTripRjsoData] = useState([])
  const [tripStoData, setTripStoData] = useState([])
  const [tripOthersStoData, setTripOthersStoData] = useState([])
  const [tripShipmentCustomerData, setTripShipmentCustomerData] = useState([])

  const [rjsoInfo, setRjsoInfo] = useState([])
  const [stoTableData, setStoTableData] = useState([])
  const [stoTableDataRMSTO, setStoTableDataRMSTO] = useState([])
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})

  const [totalTripIncome, setTotalTripIncome] = useState(0)
  const [totalTripPL, setTotalTripPL] = useState(0)

  const PLFinder = () => {
    let expense = Number(tripsettlementData.expense)
    let income = Number(values.income)

    let pl = parseFloat(income - expense).toFixed(2)

    return pl

  }

  useEffect(() => {
    const val_obj = Object.entries(values)

    val_obj.forEach(([key_st, value]) => { })
    console.log(values, 'values')
    console.log(formValues, 'formValues')
  }, [values, formValues])

  const expenseDataCapture = (event) => {
    let expense_name = event.target.name

    let expense_value = event.target.value
    // TripsheetClosureValidation(formValues)
    console.log(expense_name)
    console.log(expense_value)

    // if (expense_name == 'unloading_charges') {
    //   if (expense_value) {
    //     errors.unloading_charges = ''
    //   } else {
    //     errors.unloading_charges = 'Required'
    //   }
    // }
  }

  /* ===================== The Constants Needed For First Render Part Start ===================== */

  const [calculationValues, setCalculationValues] = useState(
    TripsheetClosureConstants.InitialCalculationValues
  )

  const [tripInfo, setTripInfo] = useState({})
  const [dieselCollectionInfo, setDieselCollectionInfo] = useState([])

  const [mainKey, setMainKey] = useState(1)
  const [activeKey, setActiveKey] = useState(1)
  const [activeKey_2, setActiveKey_2] = useState(1)
  const [ExpenseUnloadingCharges, setExpenseUnloadingCharges] = useState(0)
  const [visible, setVisible] = useState(false)
  const [fg_sales_enable, setfg_sales_enable] = useState(false)
  const [sto_enable, setsto_enable] = useState(false)
  const [rjso_enable, setrjso_enable] = useState(false)
  const [pmData, setPMData] = useState([])

  const [nlcdPlantsData, setNlcdPlantsData] = useState([])
  const [nlcdPlantsArrayData, setNlcdPlantsArrayData] = useState([])

  /* ===================== The Constants Needed For First Render Part End ===================== */

  /* ===================== The Very First Render Part Start ===================== */
  /*Tested*/

  /*Tested*/
  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return

      try {
        setFetch(false)

        const [
          settlementRes,
          shipmentRes,
          rjsoRes,
          freightRes,
          def11Res,
          def35Res,
          cap,
          body,
          stoRes,
          vehicleRes,
        ] = await Promise.all([
          NlmtTripSheetClosureService.getTripSettlementInfoByParkingId(id),
          NlmtVehicleAssignmentService.getShipmentInfoByPId(id),
          NlmtRJSaleOrderCreationService.getRJSaleOrderbyParkingId(id),
          CustomerFreightApi.getCustomerFreight(),
          DefinitionsListApi.visibleDefinitionsListByDefinition(11),
          DefinitionsListApi.visibleDefinitionsListByDefinition(35),
          NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(2), // capacity
          NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(1), // body
          NlmtTripSheetClosureService.getTripStoInfoByParkingId(id),
          NlmtTripSheetClosureService.getVehicleInfoById(id),
        ])

        // Settlement
        const settlementData = settlementRes?.data?.data?.[0] || {}
        setTripsettlementData(settlementData)
        console.log(settlementRes, 'settlementRes')
        console.log(shipmentRes, 'shipmentRes')
        const shipmentRaw = shipmentRes?.data?.data

        // NLMT returns object, convert to array for FG UI
        const shipmentData = shipmentRaw
          ? Array.isArray(shipmentRaw)
            ? shipmentRaw
            : [shipmentRaw]
          : []

        setTripFgsalesData(shipmentData)
        // RJSO
        setTripRjsoData(rjsoRes?.data?.data || [])

        // Freight Master
        setTripShipmentCustomerData(freightRes?.data?.data || [])

        // Definition 11
        setPMData(def11Res?.data?.data || [])

        // Definition 35 (NLCD Plants)
        const plantData = def35Res?.data?.data || []
        const activePlants = plantData
          .filter((c) => c.definition_list_status == 1)
          .map((c) => c.definition_list_code)

        setNlcdPlantsData(plantData)
        setNlcdPlantsArrayData(activePlants)

        // STO
        const stoList = stoRes?.data?.data || []
        setTripStoData(stoList.filter((d) => d.sto_delivery_type != 3))
        setTripOthersStoData(stoList.filter((d) => d.sto_delivery_type == 3))

        // Vehicle Info
        // Vehicle Info
        const fetchedData = vehicleRes?.data?.data || {}
        setTripInfo(fetchedData)

        // ✅ FIX: Use shipmentRes instead of vehicleRes
        const shipmentRawData = shipmentRes?.data?.data

        const shipmentArray = shipmentRawData
          ? Array.isArray(shipmentRawData)
            ? shipmentRawData
            : [shipmentRawData]
          : []

        setShipmentInfo(shipmentArray)
        console.log(shipmentArray, 'shipmentArrayshipmentArrayshipmentArray')

        // Income tab: exclude shipments whose deliveries are all MD01 or MD00 plants
        const excludedPlants = ['MD01', 'MD00']
        const incomeShipmentArray = shipmentArray.filter((shipment) =>
          shipment.shipment_child_info?.some(
            (child) => !excludedPlants.includes(child.delivery_plant)
          )
        )
        setTripFgsalesData(incomeShipmentArray)

        setPMData(def11Res?.data?.data || [])
        setFetch(true)
      } catch (error) {
        toast.error('Failed to load trip data')
        setFetch(true)
      }
    }

    fetchAllData()
  }, [id])

  console.log(tripFgsalesData, 'tripFgsalesData')
  console.log(shipmentInfo, 'shipmentInfo')

  console.log(tripInfo, 'tripInfo')
  /* ===================== The Very First Render Part End ===================== */

  /* ===================== Header Tabs Controls Part Start ===================== */

  const [tabGISuccess, setTabGISuccess] = useState(false)
  const [tabFJSuccess, setTabFJSuccess] = useState(false)
  const [tabRJSOSuccess, setTabRJSOSuccess] = useState(false)
  const [tabFGSTOSuccess, setTabFGSTOSuccess] = useState(false)
  const [tabRMSTOSuccess, setTabRMSTOSuccess] = useState(false)
  const [tabFJ_RJ_FG_RM_STO_Success, setTabFJ_RJ_FG_RM_STO_Success] = useState(false)
  const [tabDISuccess, setTabDISuccess] = useState(false)
  const [tabEXSuccess, setTabEXSuccess] = useState(false)
  const [tabFGSTOHireSuccess, setTabFGSTOHireSuccess] = useState(false)
  const [tabRMSTOHireSuccess, setTabRMSTOHireSuccess] = useState(false)
  const [tabFGSALESHireSuccess, setTabFGSALESHireSuccess] = useState(false)
  const [tabFGSALESHireAvailable, setTabFGSALESHireAvailable] = useState(false)
  const [tabFreightHireSuccess, setTabFreightHireSuccess] = useState(false)
  const [tabExpensesHireSuccess, setTabExpensesHireSuccess] = useState(false)
  const [totalFreight, setTotalFreight] = useState([])

  /* ===================== Header Tabs Controls Part End ===================== */

  useEffect(() => {
    if (shipmentInfo && shipmentInfo.length > 0) {
      setTabFGSALESHireAvailable(true)
    } else {
      setTabFGSALESHireAvailable(false)
    }
  }, [shipmentInfo])

  useEffect(() => {
    if (
      tabFGSALESHireSuccess ||
      // shipmentInfo.length === 0 ||
      // !tabFGSALESHireAvailable ||
      (stoTableData && stoTableData.length > 0) ||
      (stoTableDataRMSTO && stoTableDataRMSTO.length > 0)
    ) {
      setTabFreightHireSuccess(true)
    } else {
      setTabFreightHireSuccess(false)
    }

    console.log(tabFGSALESHireSuccess, 'tabFGSALESHireSuccess')
    console.log(tabFGSALESHireAvailable, 'tabFGSALESHireAvailable')
    console.log(stoTableData.length, 'stoTableData')
    console.log(stoTableDataRMSTO.length, 'stoTableDataRMSTO')
    console.log(tabFreightHireSuccess, 'tabFreightHireSuccess')
  }, [shipmentInfo, stoTableData, stoTableDataRMSTO, tabFGSALESHireSuccess])

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

  /* ===================== Vehicle Assignment Details (FG-SALES) Table Data Part Start ===================== */



  const panMobileCheck = (data) => {
    console.log(data, 'panMobileCheck')
    let mobValue = data.TELF1 ? data.TELF1 : ''
    let mobCondition = 0
    if (mobValue.trim() != '') {
      // if(data.TELF1 && /^[\d]{10}$/.test(data.TELF1)){
      mobCondition = 1
    }
    return mobCondition
  }

  useEffect(() => {
    if (vpan) {
      PanDataService.getPanData(vpan).then((res) => {
        if (res.status == 200 && res.data != '') {
          console.log(res.data[0], 'panNumbernew')
          if (panMobileCheck(res.data[0]) === 1) {
            console.log('SAP-VENDOR-MOBILE-NUMBER-VERIFIED')
            setVpanMobile(res.data[0].TELF1)
            setVpanMobileHaving(true)
          } else {
            console.log('SAP-VENDOR-MOBILE-NUMBER-MISSING/INVALID')
            toast.warning(
              'SAP - Vendor Mobile Number was Missing or Invalid. Kindly update Address in SAP..'
            )
            setVpanMobileHaving(false)
            setVpanMobile(0)
          }
        } else {
          setVpanMobileHaving(false)
        }
      })
    }
  }, [vpan])

  /* ===================== Vehicle Assignment Details Table Data Part End ===================== */

  /* ================= Vehicle Assignment Details Table Income Capture Part Start ============= */

  const onlyNumberKey = (evt) => {
    console.log(evt, 'evt')
    // Only ASCII character in that range allowed
    var ASCIICode = evt.which ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false
    return true
  }

  /* ===================== TripsheetIncomeClosureSubmit Start ===================== */

  const TripsheetIncomeClosureSubmit = () => {

    if (values.income == '' || values.income == 0) {
      toast.warning('Income Posting Amount should be required..!')
      return false
    }

    if (values.income < 0) {
      toast.warning('Income Posting Amount should be greater than zero..!')
      return false
    }

    if (values.income_posting_date == '') {
      toast.warning('You should select income posting date before submitting..!')
      return false
    }

    let Expense_Income_Posting_Date_Taken = ExpenseIncomePostingDate()
    let from_date = Expense_Income_Posting_Date_Taken.min_date
    let to_date = Expense_Income_Posting_Date_Taken.max_date

    if (JavascriptDateCheckComponent(from_date, values.income_posting_date, to_date)) {
      setIncomeSubmit(true)
    } else {
      setFetch(true)
      setIncomeSubmit(false)
      toast.warning('Invalid Income Posting date')
      return false
    }

  }

  const validationApproval = () => {

    if (values.income_posting_date == '') {
      setFetch(true)
      toast.warning('You should select payment posting date before submitting..!')
      return false
    }

    let Expense_Income_Posting_Date_Taken = ExpenseIncomePostingDate()
    let from_date = Expense_Income_Posting_Date_Taken.min_date
    let to_date = Expense_Income_Posting_Date_Taken.max_date

    if (JavascriptDateCheckComponent(from_date, values.income_posting_date, to_date)) {
      // setIncomeSubmit(true)
    } else {
      setFetch(true)
      // setIncomeSubmit(false)
      toast.warning('Invalid Payment Posting date')
      return false
    }

    /* =================== Request Sent To SAP For Invoice No. Generation Start ======================= */

    var LineItem = {}
    var LineItemSeq = []

    for (var i = 0; i < 1; i++) {
      LineItem.LINE_ITEM = String(i + 1)
      LineItem.TRIPSHEET_NO = tripsettlementData.tripsheet_no

      LineItemSeq[i] = LineItem
      LineItem = {}
    }

    const sap_data = [
      {
        PAY_REF: tripsettlementData.tripsheet_no,
        LIFNR: tripInfo?.driver_info?.driver_code,
        POST_DATE: values.income_posting_date,
        BANK_PAYMENT: tripsettlementData.sap_expense_amount,
        BANK_REMARKS: values.income_sap_text,
        PLANT: 'NLMD',
        LINE: LineItemSeq,
      },
    ]

    const now = new Date();

    const closure_updation_time =
      now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0');

    console.log(closure_updation_time, 'closure_updation_time');

    // sap_data.append('depo_location', depoLocation)

    console.log(sap_data, 'validationApproval-sap_data')
    // setFetch(true)
    // return false

    NlmtTripSheetClosureService.NlmtDriverPaymentInvoiceCreation(sap_data).then((res) => {
      let sap_invoice_no = res.data.BANK_PAYMENT_DOC_NO
      let sap_invoice_status = res.data.BANK_PAYMENT_STATUS
      let sap_invoice_message = res.data.BANK_PAYMENT_MESSAGE
      let sap_invoice_reference = res.data.PAY_REF

      console.log(
        sap_invoice_no +
        '/' +
        sap_invoice_status +
        '/' +
        sap_invoice_message +
        '/' +
        sap_invoice_reference
      )

      if (
        sap_invoice_status == '1' &&
        res.status == 200 &&
        sap_invoice_no &&
        sap_invoice_message &&
        sap_invoice_reference == tripsettlementData.tripsheet_no
      ) {

        const formData = new FormData()
        formData.append('_method', 'PUT')
        formData.append('parking_id', tripInfo.nlmt_trip_in_id)
        formData.append('vehicle_id', tripInfo.vehicle_id)
        formData.append('driver_payment_remarks', values.income_remarks)
        formData.append('driver_payment_by', user_id)
        formData.append('driver_payment_at', closure_updation_time)
        formData.append('driver_payment_sap_text', values.income_sap_text)
        // formData.append('driver_payment_copy', sap_expense_post_document)
        formData.append('payment_status', 3)
        formData.append('driver_payment', 1)
        formData.append('driver_payment_sap_document_no', sap_invoice_no)
        formData.append('driver_payment_posting_date', values.income_posting_date)
        formData.append('closure_updation_time', closure_updation_time)
        formData.append('updated_by', user_id)
        formData.append('own_closure_status', 6) /* 6 - Payment Approved (32) */
        formData.append('tripsheet_is_settled', 6) /* Payment Completed */

        let tripSettlementID = tripsettlementData.id
        // setFetch(true)
        // return false

        NlmtTripSheetClosureService.updateTripsheetSettlement(tripSettlementID, formData).then((res) => {
          console.log(res)
          if (res.status == 200) {
            setFetch(true)
            Swal.fire({
              title: "Tripsheet Driver Payment Posting Process Done Successfully!",
              icon: "success",
              html: 'SAP Payment Document No : ' + sap_invoice_no,
              confirmButtonText: "OK",
            }).then(function () {
              navigation('/NlmtTSPaymentHome')
            })

          } else {
            setFetch(true)
            toast.warning('Tripsheet Driver Payment Posting Process Failed..')
            // navigation('/NlmtTSExpenseClosureHome')
          }
        })
          .catch((err) => {
            console.error('NLMT Driver Payment Posting Submission Error:', err)
            toast.error('Failed to submit NLMT Driver Payment Posting in PRO. Please try again.')
            setFetch(true)
          })

      } else if (
        sap_invoice_status == '2' &&
        res.status == 200 &&
        sap_invoice_no == '' &&
        sap_invoice_message &&
        sap_invoice_reference == tripsettlementData.tripsheet_no
      ) {
        setFetch(true)
        Swal.fire({
          title: sap_invoice_message,
          icon: 'warning',
          confirmButtonText: 'OK',
        }).then(function () {
          // window.location.reload(false)
        })
      } else {
        setFetch(true)
        toast.warning('Driver Payment Posting Submission Failed in SAP.. Kindly Contact Admin!')
      }
    })
      .catch((err) => {
        console.error('NLMT Driver Payment Posting Submission Error:', err)
        toast.error('Failed to submit NLMT Driver Payment Posting Submission in SAP. Please try again.')
        setFetch(true)
      })
  }

  /* ===================== TripsheetIncomeClosureSubmit End ===================== */

  /* ===================== All Expenses Capture Part Start  ======================= */
  const [expensesData, setExpensesData] = useState([])
  const [formExpensesData, setFormExpensesData] = useState([])
  const [totalTollAmount, setTotalTollAmount] = useState(0)
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
  const [totalStockDiversionReturnCharges, setTotalStockDiversionReturnCharges] = useState(0)
  const [totalHaltDays, setTotalHaltDays] = useState(0)
  const [totalHaltingCharges, setTotalHaltingCharges] = useState(0)
  const [totalCharges, setTotalCharges] = useState(0)
  const [totalChargesOwn, setTotalChargesOwn] = useState(0)
  const [totalChargesHire, setTotalChargesHire] = useState(0)

  const totalChargesFinder = () => {
    let total_charge = 0
    if (Number(tripInfo?.vehicle_info?.vehicle_type_id) === 22) {
      total_charge =
        Number(totalUnloadingCharges ? totalUnloadingCharges : 0) +
        Number(totalWeighmentCharges ? totalWeighmentCharges : 0) +
        Number(totalFreightCharges ? totalFreightCharges : 0) +
        Number(totalStockDiversionReturnCharges ? totalStockDiversionReturnCharges : 0) +
        Number(totalHaltingCharges ? totalHaltingCharges : 0) +
        Number(totalSubDeliveryCharges ? totalSubDeliveryCharges : 0)
    } else {
      total_charge =
        Number(totalTollAmount ? totalTollAmount : 0) +
        Number(totalBata ? totalBata : 0) +
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

    console.log(total_charge)

    return total_charge
  }

  const totalChargesCalculator = (data) => {
    let total_charge = 0
    Object.keys(tripInfo).length
    console.log(tripInfo)
    if (Number(tripInfo?.vehicle_info?.vehicle_type_id) === 22) {
      total_charge =
        Number(data.unloading_charges ? data.unloading_charges : 0) +
        Number(data.sub_delivery_charges ? data.sub_delivery_charges : 0) +
        Number(data.weighment_charges ? data.weighment_charges : 0) +
        Number(data.freight_charges ? data.freight_charges : 0) +
        Number(data.diversion_return_charges ? data.diversion_return_charges : 0) +
        Number(data.halting_charges ? data.halting_charges : 0)
    } else {
      total_charge =
        Number(data.toll_amount ? data.toll_amount : 0) +
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
        Number(ExpenseUnloadingCharges ? ExpenseUnloadingCharges : 0)
    }

    if (tripInfo.rj_so_info && tripInfo.rj_so_info.length > 0) {
      let rjso_expenses =
        Number(data.rjso_tarpaulin_charges ? data.rjso_tarpaulin_charges : 0) +
        Number(data.rjso_weighment_charges ? data.rjso_weighment_charges : 0) +
        Number(data.rjso_unloading_charges ? data.rjso_unloading_charges : 0) +
        Number(data.rjso_loading_charges ? data.rjso_loading_charges : 0) +
        Number(data.rjso_bata_amount ? data.rjso_bata_amount : 0) +
        Number(data.rjso_commision_charges ? data.rjso_commision_charges : 0) +
        Number(data.rjso_misc_charges ? data.rjso_misc_charges : 0)
      Number(data.rjso_munic_charges ? data.rjso_munic_charges : 0)
      Number(data.rjso_halt_charges ? data.rjso_halt_charges : 0)
      Number(data.rjso_en_diesel_charges ? data.rjso_en_diesel_charges : 0)
      console.log(rjso_expenses, 'rjso_expenses')
      total_charge = total_charge + rjso_expenses
    }

    console.log(total_charge)

    return total_charge
  }

  useEffect(() => {
    if (Object.keys(tripInfo).length > 0) {
      setTotalChargesOwn(totalChargesCalculator(values))
      setTotalChargesHire(totalChargesCalculator(values))
    }
  }, [values, tripInfo])

  useEffect(() => {
    console.log(totalTollAmount, 'totalTollAmount')
    console.log(totalBata, 'totalBata')
    console.log(totalMunicipalCharges, 'totalMunicipalCharges')
    console.log(totalPortEntryFee, 'totalPortEntryFee')
    console.log(totalMiscCharges, 'totalMiscCharges')
    console.log(totalFineAmount, 'totalFineAmount')
    console.log(totalSubDeliveryCharges, 'totalSubDeliveryCharges')
    console.log(totalMaintenanceCost, 'totalMaintenanceCost')
    console.log(totalLoadingCharges, 'totalLoadingCharges')
    console.log(totalUnloadingCharges, 'totalUnloadingCharges')
    console.log(totalTarpaulinCharges, 'totalTarpaulinCharges')
    console.log(totalWeighmentCharges, 'totalWeighmentCharges')
    console.log(totalLowTonageCharges, 'totalLowTonageCharges')
    console.log(totalStockDiversionReturnCharges, 'totalStockDiversionReturnCharges')
    console.log(totalCharges, 'totalCharges')
    setTotalCharges(totalChargesFinder())
  }, [
    totalTollAmount,
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
    totalStockDiversionReturnCharges,
  ])
  useEffect(() => {
    let lp_trip_data = [{ shipmentInfo }, { rjsoInfo }, { stoTableData }, { stoTableDataRMSTO }]

    setTotalTollAmount(ExpenseCalculations(lp_trip_data, 'toll_amount'))
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
    setTotalLowTonageCharges(ExpenseCalculations(lp_trip_data, 'low_tonage_charges'))
    setTotalStockDiversionReturnCharges(
      ExpenseCalculations(lp_trip_data, 'diversion_return_charges')
    )
    setTotalHaltDays(ExpenseCalculations(lp_trip_data, 'halt_days'))
    setTotalHaltingCharges(ExpenseCalculations(lp_trip_data, 'halting_charges'))
    setTotalFreightCharges(ExpenseCalculations(lp_trip_data, 'freight_charges'))
  }, [shipmentInfo, rjsoInfo, stoTableData, stoTableDataRMSTO])

  /* ================= FGSALES ========================================= */

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
  const [incomeReject, setIncomeReject] = useState(false)
  const [incomeSubmit, setIncomeSubmit] = useState(false)
  const [stoPodVisibleRMSTO, setStoPodVisibleRMSTO] = useState(false)
  const [stoFileUploadVisibleRMSTO, setStoFileUploadVisibleRMSTO] = useState(true)
  const [stoDeliveryInvalidRMSTO, setStoDeliveryInvalidRMSTO] = useState(true)

  const [stoValuesRMSTO, setStoValuesRMSTO] = useState(
    TripsheetClosureConstants.stoInitialStateRMSTO
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

  /* ===== Unregistered Vendor Constants, Functions, Calculations Part Start  =========== */

  const [urvValues, setUrvValues] = useState(TripsheetClosureConstants.InitialURVValues)
  const [rvValues, setRvValues] = useState(TripsheetClosureConstants.InitialRVValues)
  const [rvTotalValues, setRvTotalValues] = useState([])
  const [rvTotalValuesBP, setRvTotalValuesBP] = useState([])
  const [urvTotalAmountFinder, seturvTotalAmountFinder] = useState(0)
  const [tdlDieselInfo, setTdlDieselInfo] = useState(0)
  const [arplDieselInfo, setArplDieselInfo] = useState(0)
  const [tdaDieselInfo, setTdaDieselInfo] = useState(0)

  const vendorCodeFinder = (data) => {
    let v_code = ''
    if (data.Parking_Vendor_Info) {
      v_code = data.Parking_Vendor_Info.vendor_code
    } else {
      v_code = data.vendor_info.vendor_code
    }
    console.log(v_code, 'vendorDataAssignment-v_code')
    console.log(data, 'vendorDataAssignment-data')
    return v_code
  }

  const addEnable = (data) => {
    console.log(data)
    var hire_vehicle_check = tripInfo.vehicle_type_id.id == 3 ? true : false
    console.log(hire_vehicle_check, 'hire_vehicle_check')
    if (
      data.sto_delivery_number != '' &&
      data.sto_po_number != '' &&
      data.sto_delivery_division != '' &&
      data.sto_from_location != '' &&
      data.sto_to_location != '' &&
      data.sto_delivery_quantity != '' &&
      data.sto_freight_amount != '' &&
      // data.sto_delivery_date_time != '' &&
      // data.sto_pod_copy != '' &&
      (data.sto_delivery_driver_name != '' || hire_vehicle_check)
    ) {
      setStoDeliveryInvalid(false)
      return true
    } else {
      setStoDeliveryInvalid(true)
      return false
    }
  }


  const addEnableRMSTO = (data) => {
    console.log(data)
    let hire_vehicle_check_rmsto = tripInfo?.vehicle_info?.vehicle_type_id == 21 ? true : false
    if (
      data.sto_delivery_number_rmsto != '' &&
      data.sto_po_number_rmsto != '' &&
      data.sto_delivery_division_rmsto != '' &&
      data.sto_from_location_rmsto != '' &&
      data.sto_to_location_rmsto != '' &&
      data.sto_delivery_quantity_rmsto != '' &&
      data.sto_freight_amount_rmsto != '' &&
      data.sto_delivery_date_time_rmsto != '' &&
      data.sto_pod_copy_rmsto != '' &&
      (data.sto_delivery_driver_name_rmsto != '' || hire_vehicle_check_rmsto)
    ) {
      setStoDeliveryInvalidRMSTO(false)
      return true
    } else {
      setStoDeliveryInvalidRMSTO(true)
      return false
    }
  }

  const handleStoValueChangeRMSTO = (event) => {
    let value_change = event.target.value
    if (
      event.target.name == 'sto_delivery_number_rmsto' ||
      event.target.name == 'sto_po_number_rmsto' ||
      event.target.name == 'sto_delivery_division_rmsto' ||
      event.target.name == 'sto_freight_amount_rmsto'
    ) {
      value_change = event.target.value.replace(/\D/g, '')
    } else if (
      event.target.name == 'sto_from_location_rmsto' ||
      event.target.name == 'sto_to_location_rmsto'
    ) {
      value_change = event.target.value.replace(/[^a-zA-Z ]/gi, '')
    } else if (event.target.name == 'sto_delivery_quantity_rmsto') {
      value_change = event.target.value
        .replace(/[^0-9^\.]+/g, '')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^0+/, '')
    }
    let updatedinputs = { ...stoValuesRMSTO, [event.target.name]: value_change }
    setStoValuesRMSTO(updatedinputs)
    addEnableRMSTO(updatedinputs)
  }

  const handleStoExpenseCaptureChangeRMSTO = (event) => {
    let updatedinputs = { ...stoValuesRMSTO, [event.target.name]: event.target.checked }
    setStoValuesRMSTO(updatedinputs)
    console.log(stoValuesRMSTO)
    console.log(stoTableDataRMSTO)
  }

  const handleStoFileUploadChangeRMSTO = (event) => {
    console.log(event.target)
    let uploaded_file_path_rmsto = URL.createObjectURL(event.target.files[0])
    // let uploaded_file_path_rmsto = event.target.files[0]
    setFilePathRMSTO(uploaded_file_path_rmsto)
    setStoFileUploadVisibleRMSTO(false)
    let updatedinputs_rmsto = { ...stoValuesRMSTO, [event.target.name]: uploaded_file_path_rmsto }
    setStoValuesRMSTO(updatedinputs_rmsto)
  }

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

    if (tripsettlementData.enroute_diesel_liter) {
      setTdlDieselInfo(
        rvTotalValues.rvTotalDieselLiter + Number(tripsettlementData.enroute_diesel_liter)
      )
    } else {
      setTdlDieselInfo(rvTotalValuesBP.rvTotalDieselLiter)
    }

    if (tripsettlementData.enroute_diesel_amount) {
      setTdaDieselInfo(
        rvTotalValues.rvTotalDieselAmount + Number(tripsettlementData.enroute_diesel_amount)
      )
    } else {
      setTdaDieselInfo(rvTotalValuesBP.rvTotalDieselAmount)
    }

    setArplDieselInfo(Number(tdaDieselInfo) / Number(tdlDieselInfo))

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

  /* Remove STO DETAILS */
  const emptySToData = () => {
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

    console.log(updatedinputs)

    setStoValues(updatedinputs)
    addEnable(updatedinputs)
  }

  /* ExpenseTotalCHarges Calculation */
  useEffect(() => {
    console.log(shipmentInfo)
    console.log(rjsoInfo)

    var unload_charge = 0

    if (shipmentInfo.length > 0) {
      shipmentInfo.map((parent, parent_id) => {
        parent.shipment_child_info.map((child, child_id) => {
          unload_charge += Number(child.unloading_charges_input)
        })
      })
    }

    if (rjsoInfo.length > 0) {
      rjsoInfo.map((parent, parent_id) => {
        console.log(parent.unloading_charges, 'rjso-unloadcharge')
        unload_charge += Number(parent.unloading_charges_input)
      })
    }

    setExpenseUnloadingCharges(unload_charge)
  }, [shipmentInfo, rjsoInfo])

  /* tabFJISuccess Setup */
  useEffect(() => {
    if (shipmentInfo) {
      let vad_data_valid = true
      const val_data_array = []
      console.log(vad_data_valid, 'vad_data_valid1')
      shipmentInfo.map((parent, parent_id) => {
        parent.shipment_child_info.map((child, child_id) => {
          console.log(child)
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
              validated: false,
            })
          }
        })
        console.log(vad_data_valid, 'vad_data_valid2')
      })

      val_data_array.map((value, index) => {
        if (value.validated === false) {
          vad_data_valid = false
        }
      })
      console.log(val_data_array, 'val_data_array')

      console.log(vad_data_valid, 'vad_data_valid3')
      if (vad_data_valid && val_data_array.length !== 0) {
        setTabFJSuccess(true)

        console.log('11')
      } else {
        setTabFJSuccess(false)

        console.log('12')
      }
    }
  }, [shipmentInfo, tabFJSuccess])

  /* TabFGSALESHireSuccess Setup */
  useEffect(() => {
    if (shipmentInfo) {
      let vad_data_valid = true
      const val_data_array1 = []
      console.log(vad_data_valid, 'vad_data_valid1')
      shipmentInfo.map((parent, parent_id) => {
        parent.shipment_child_info.map((child, child_id) => {
          // console.log(child)
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
              validated: false,
            })
          }
        })
        console.log(vad_data_valid, 'vad_data_valid2')
      })

      val_data_array1.map((value, index) => {
        if (value.validated === false) {
          vad_data_valid = false
        }
      })
      console.log(val_data_array1, 'val_data_array1')

      console.log(vad_data_valid, 'vad_data_valid3')
      if (vad_data_valid && val_data_array1.length !== 0) {
        setTabFGSALESHireSuccess(true)
        console.log('41')
      } else {
        setTabFGSALESHireSuccess(false)
        console.log('42')
      }
    }
  }, [shipmentInfo, tabFGSALESHireSuccess])

  /* tabRJSOISuccess Setup */
  useEffect(() => {
    if (rjsoInfo) {
      let rjso_data_valid = true
      const rjso_data_array = []
      rjsoInfo.map((parent, parent_id) => {
        // console.log(parent)
        if (
          parent.actual_delivery_date_time_validated &&
          parent.unloading_charges_validated &&
          parent.rj_pod_copy_validated
        ) {
          rjso_data_array.push({
            parent: parent_id,
            validated: true,
          })
        } else {
          rjso_data_array.push({
            parent: parent_id,
            validated: false,
          })
        }
      })

      console.log(rjso_data_array, 'rjso_data_array')

      rjso_data_array.map((value, index) => {
        if (value.validated == false) {
          rjso_data_valid = false
        }
      })
      // console.log(rjso_data_array)

      if (rjso_data_valid) {
        console.log('rjso_data_valid-111')
        setTabRJSOSuccess(true)
      } else {
        console.log('rjso_data_valid-112')
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
    console.log(stoTableData, 'stoTableDataTest1')
    if (stoTableData && tripInfo && tripInfo.tripsheet_info) {
      console.log(stoTableData, 'stoTableDataTest2')
      {
        /* Condition 1 : FGSTO data must have atleast 1 child */
      }
      let condition1 = stoTableData.length > 0 ? true : false

      console.log(condition1, 'condition1')

      {
        /* Condition 2 : FGSTO Trip Addon Availability Not Chosen and  FGSTO data have 0 elements and FGSTO is not a FJ Journey  */
      }
      let condition2 =
        stoTableData.length === 0 &&
          fgsto_tripAddonAvailability == 2 &&
          tripInfo.tripsheet_info.purpose !== '2'
          ? true
          : false

      console.log(condition2, 'condition2')

      console.log(stoTableData.length, '1')
      console.log(fgsto_tripAddonAvailability, '2')
      console.log(tripInfo.tripsheet_info.purpose, 'trip_purpose')

      if (condition1 || condition2) {
        console.log('setTrue1')
        setTabFGSTOSuccess(true)
      } else {
        console.log('setFalse')
        setTabFGSTOSuccess(false)
      }
    }
  }, [stoTableData, tripInfo])
  // }, [])

  /* tabRMSTOISuccess Setup */
  useEffect(() => {
    console.log(stoTableDataRMSTO, 'stoTableDataRMSTO1')
    if (stoTableDataRMSTO && tripInfo && tripInfo.tripsheet_info) {
      console.log(stoTableDataRMSTO, 'stoTableDataRMSTO2')
      {
        /* Condition 3 : RMSTO data must have atleast 1 child */
      }
      let condition3 = stoTableDataRMSTO.length > 0 ? true : false
      console.log(condition3, 'condition3')

      {
        /* Condition 4 : RMSTO Trip Addon Availability Not Chosen and  RMSTO data have 0 elements and RMSTO is not a FJ Journey*/
      }
      let condition4 =
        stoTableDataRMSTO.length === 0 &&
          rmsto_tripAddonAvailability === 2 &&
          tripInfo.tripsheet_info.purpose !== '3'
          ? true
          : false

      console.log(condition4, 'condition4')

      console.log(stoTableDataRMSTO.length, '1')
      console.log(rmsto_tripAddonAvailability, '2')
      console.log(tripInfo.tripsheet_info.purpose, 'trip_purpose')
      if (condition3 || condition4) {
        setTabRMSTOSuccess(true)
      } else {
        setTabRMSTOSuccess(false)
      }
    }
  }, [stoTableDataRMSTO, tripInfo])
  // }, [])

  /* tabFJ_RJ_FG_RM_STO_Success Setup */
  useEffect(() => {
    console.log(stoTableData, 'stoTableData3')
    if (
      stoTableData &&
      tripInfo &&
      tripInfo.tripsheet_info &&
      shipmentInfo &&
      stoTableDataRMSTO &&
      rjsoInfo
    ) {
      console.log(stoTableData, 'stoTableData4')
      let fgsto_not_available_condition_for_di =
        stoTableData.length === 0 &&
          fgsto_tripAddonAvailability === 2 &&
          tripInfo.tripsheet_info.purpose !== '2'
          ? true
          : false

      console.log(stoTableData.length)
      console.log(fgsto_tripAddonAvailability)
      console.log(tripInfo.tripsheet_info.purpose)
      let fgsto_available_with_proper_condition_for_di =
        stoTableData.length > 0 &&
          fgsto_tripAddonAvailability === 2 &&
          tripInfo.tripsheet_info.purpose === '2'
          ? true
          : false
      let rmsto_not_available_condition_for_di =
        stoTableDataRMSTO.length === 0 &&
          rmsto_tripAddonAvailability === 2 &&
          tripInfo.tripsheet_info.purpose !== '3'
          ? true
          : false
      let rmsto_available_with_proper_condition_for_di =
        stoTableDataRMSTO.length > 0 &&
          rmsto_tripAddonAvailability === 2 &&
          tripInfo.tripsheet_info.purpose === '3'
          ? true
          : false
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
        'rmsto_available_with_proper_condition_for_di'
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
        console.log('rjso_data_valid-211')
        setTabFJ_RJ_FG_RM_STO_Success(true)
      } else {
        console.log('rjso_data_valid-212')
        setTabFJ_RJ_FG_RM_STO_Success(false)
      }
    }
  }, [tripInfo, shipmentInfo, stoTableData, stoTableDataRMSTO, rjsoInfo])

  /* tabDISuccess Setup */
  useEffect(() => {
    let fgsalesdi_data = shipmentInfo
    let rjsodi_data = rjsoInfo
    let fgstodi_data = stoTableData
    let rmstodi_data = stoTableDataRMSTO

    let addon_available_array = []

    console.log(
      shipmentInfo.length,
      '-',
      rjsoInfo.length,
      '-',
      stoTableData.length,
      '-',
      stoTableDataRMSTO.length
    )

    let fgsalesdi_data_validity = []
    let rjsodi_data_validity = []
    let fgstodi_data_validity = []
    let rmstodi_data_validity = []

    let fgsalesdi_data_availability = shipmentInfo.length === 0 ? false : true
    let rjsodi_data_availability = rjsoInfo.length === 0 ? false : true
    let fgstodi_data_availability = stoTableData.length === 0 ? false : true
    let rmstodi_data_availability = stoTableDataRMSTO.length === 0 ? false : true

    if (fgsalesdi_data_availability) {
      console.log(shipmentInfo)
      shipmentInfo.map((parent_val1, index1) => {
        if (
          // parent_val1.diesel_cons_qty_ltr_input &&
          parent_val1.opening_km_input &&
          parent_val1.closing_km_input
        ) {
          fgsalesdi_data_validity[index1] = true
        } else {
          fgsalesdi_data_validity[index1] = false
        }
      })
    }

    if (rjsodi_data_availability) {
      rjsoInfo.map((parent_val2, index2) => {
        if (
          // parent_val2.diesel_cons_qty_ltr_input &&
          parent_val2.opening_km_input &&
          parent_val2.closing_km_input
        ) {
          rjsodi_data_validity[index2] = true
        } else {
          rjsodi_data_validity[index2] = false
        }
      })
    }

    if (fgstodi_data_availability) {
      console.log(stoTableData)
      stoTableData.map((parent_val3, index3) => {
        if (
          // parent_val3.diesel_cons_qty_ltr_input &&
          parent_val3.opening_km_input &&
          parent_val3.closing_km_input
        ) {
          fgstodi_data_validity[index3] = true
        } else {
          fgstodi_data_validity[index3] = false
        }
      })
    }

    if (rmstodi_data_availability) {
      console.log(stoTableDataRMSTO)
      stoTableDataRMSTO.map((parent_val4, index4) => {
        if (
          // parent_val4.diesel_cons_qty_ltr_input &&
          parent_val4.opening_km_input &&
          parent_val4.closing_km_input
        ) {
          rmstodi_data_validity[index4] = true
        } else {
          rmstodi_data_validity[index4] = false
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
    rmstodi_data_availability
      ? addon_available_array.push({ rmstodi_data_availability: rmstodi_data_validity })
      : ''

    console.log(fgsalesdi_data_validity)
    console.log(rjsodi_data_validity)
    console.log(fgstodi_data_validity)
    console.log(rmstodi_data_validity)
    var di_success_valid = true
    console.log(addon_available_array, 'addon_available_array')

    addon_available_array.map((dataA, indexA) => {
      if (dataA.fgsalesdi_data_availability && dataA.fgsalesdi_data_availability.length > 0) {
        dataA.fgsalesdi_data_availability.map((dataA1, indexA1) => {
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

      console.log(di_success_valid)

      if (di_success_valid) {
        setTabDISuccess(true)
      } else {
        setTabDISuccess(false)
      }
    })
  }, [shipmentInfo, rjsoInfo, stoTableData, stoTableDataRMSTO, tripInfo])

  const getGSTTaxTypeName = (value) => {
    let data = ''
    if (value == 'Empty') {
      data = 'No Tax'
    } else if (value == 'R5') {
      data = 'Input Tax RCM (SGST,CGST @ 2.5% & 2.5%)'
    } else if (value == 'F6') {
      data = 'Input Tax (SGST,CGST @ 6% & 6%)'
    }

    values.GSTtax = value
    return data
  }

  const getTdsTypeHaving = (value) => {
    let data = ''
    if (value == '1') {
      data = 'YES'
    } else if (value == '2') {
      data = 'NO'
    }
    values.TdsHaving = value
    return data
  }

  /* KM Differce Calculation */
  useEffect(() => {
    if (tripsettlementData.budgeted_km) {
      setDifferenceKMFinder(
        tripKMFinder(tripInfo.odometer_km, tripInfo.odometer_closing_km) -
        Number(tripsettlementData.budgeted_km)
      )
    } else {
      setDifferenceKMFinder('-')
    }
  })

  /* Mileage Differce Calculation */
  useEffect(() => {
    if (tripsettlementData.budgeted_mileage && tripsettlementData.actual_mileage) {
      setDifferenceMileageFinder(
        parseFloat(
          Number(tripsettlementData.actual_mileage) - Number(tripsettlementData.budgeted_mileage)
        ).toFixed(2)
      )
    } else {
      setDifferenceMileageFinder('-')
    }
  })

  useEffect(() => {
    if (tripInfo.diesel_intent_info && tripInfo.diesel_intent_info.vendor_code) {
      DieselVendorMasterService.getDieselVendorsByCode(
        tripInfo.diesel_intent_info.vendor_code
      ).then((res) => {
        console.log(res.data.data)
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

  const sendDriverExpenseToSAP = () => {
    console.log(tripsettlementData, 'tripsettlementData')
    console.log(tripInfo, 'tripInfo')

    console.log(rjsoInfo, 'trip_rj_info')
    console.log(shipmentInfo, 'trip_shipment_info')
    console.log(tripStoData, 'trip_sto_info')

    // return false;

    let sapData = new FormData()


    // "TRIPSHEET_NO": "OD44446",
    // "VEHICLE_NO ": "TN57BB1203",
    // "DIVISION": "NLMD",
    // "TOT_FRE_INC": "100",
    // "POST_DATE": "2026-06-09",
    // "KUNNR": "1003",
    // "REMARKS": "TEST" 

    sapData.append('TRIPSHEET_NO', tripsettlementData.tripsheet_no)
    sapData.append('VEHICLE_NO', tripInfo.vehicle_info.vehicle_number)
    sapData.append('DIVISION', 'NLMD')
    sapData.append('TOT_FRE_INC', values.income)
    sapData.append('POST_DATE', values.income_posting_date)
    sapData.append('KUNNR', nlmt_expense_vendor_code)
    sapData.append('REMARKS', values.income_sap_text)

    console.log(sapData)
    NlmtTripSheetClosureSapService.tsDivisionIncomePost(sapData)
      .then((res) => {
        console.log(res, 'resresresres')

        let sap_resp = res.data && res.data[0] ? res.data[0] : ''

        if (sap_resp == '') {
          setFetch(true)
          Swal.fire({
            title: 'SAP Income Posting failed and get Invalid SAP response.. Kindly Contact Admin!',
            icon: 'warning',
            confirmButtonText: 'OK',
          })
        }

        let sap_ts_no = sap_resp.TRIPSHEET_NO
        let sap_status = sap_resp.STATUS
        let sap_expense_post_document = sap_resp.DOCUMENT_NO
        let sap_expense_post_message = sap_resp.MESSAGE

        console.log(sap_ts_no, 'sap_ts_no')
        console.log(sap_status, 'sap_status')
        console.log(sap_expense_post_document, 'sap_expense_post_document')
        console.log(sap_expense_post_message, 'sap_expense_post_message')

        setDriverExpenseSapDocumentNo(sap_expense_post_document)

        console.log(
          sap_ts_no +
          '/' +
          sap_status +
          '/' +
          sap_expense_post_document +
          '/' +
          sap_expense_post_message
        )

        if (sap_status == '1' &&
          res.status == 200 &&
          sap_expense_post_document &&
          sap_expense_post_message &&
          sap_ts_no == tripsettlementData.tripsheet_no
        ) {

          try {
            // ✅ Isolate runtime errors from network errors
            addIncomeClosureRequest(sap_expense_post_document)
          } catch (runtimeError) {
            setFetch(true)
            console.error('Runtime error in addIncomeClosureRequest:', runtimeError)
            Swal.fire({
              title: 'An internal error occurred while submitting closure. Kindly contact Admin!',
              text: runtimeError.message,
              icon: 'error',
              confirmButtonText: 'OK',
            })
          }
        } else if (
          (sap_status == '2') &&
          res.status == 200 &&
          sap_expense_post_document == '' &&
          sap_expense_post_message &&
          sap_ts_no == tripsettlementData.tripsheet_no
        ) {
          setFetch(true)
          Swal.fire({
            title: sap_expense_post_message + ' Kindly Contact Admin..',
            icon: "warning",
            confirmButtonText: "OK",
          }).then(function () {
            // window.location.reload(false)
          })

        } else {
          setFetch(true)
          Swal.fire({
            title: 'SAP Income Posting Failed.. Kindly Contact Admin!',
            icon: 'warning',
            confirmButtonText: 'OK',
          })
        }
      })
      .catch((error) => {
        // ✅ This now ONLY catches actual network/API failures
        setFetch(true)
        console.error('SAP API network error:', error)
        Swal.fire({
          title: 'Server Connection Failed. Kindly contact Admin.!',
          text: error.message,
          icon: 'warning',
          confirmButtonText: 'OK',
        })
      })
  }
  /* Income Closure Submit Request ( Status2 = reject, Status3 = submit,) */
  const addIncomeClosureRequest = (sap_expense_post_document = '') => {

    const formData = new FormData()

    formData.append('income_posting_date', values.income_posting_date)
    formData.append('income', values.income)
    formData.append('profit_and_loss', PLFinder())
    formData.append('income_sap_document_no', sap_expense_post_document)
    formData.append('income_sap_text', values.income_sap_text)
    formData.append('income_remarks', values.income_remarks ? values.income_remarks : '')
    formData.append('updated_by', user_id)

    NlmtTripSheetClosureService.updateIncomeClosureAcception(id, formData).then((res) => {
      // alert('success')
      setFetch(true)

      if (res.status == 200) {
        // toast.success('Income Closure Submitted!')
        // navigation('/TSIncomeCapture')
        Swal.fire({
          title: 'Income Closure Submitted Successfully..!',
          icon: 'success',
          text: 'SAP Income Doc. No : ' + sap_expense_post_document,
          confirmButtonText: 'OK',
        }).then(function () {
          navigation('/NlmtTSIncomeClosureHome')
        })
      } else {
        // toast.warning('Something Went Wrong !')
        Swal.fire({
          title: 'Income Closure Submission Failed in LP.. Kindly Contact Admin!',
          icon: 'warning',
          confirmButtonText: 'OK',
        }).then(function () {
          // window.location.reload(false)
        })
      }
    })
      .catch((error) => {
        // alert('failure')
        setFetch(true)
        var object = error.response.data.errors
        var output = ''
        for (var property in object) {
          output += '*' + object[property] + '\n'
        }
        setError(output)
        setErrorModal(true)
      })

  }

  /* =========== Others Tripsheet Reworks Part Start ask1=========== */

  const [divisionData, setDivisionData] = useState([])
  const [departmentData, setDepartmentData] = useState([])
  const [vehicleVariety, setVehicleVariety] = useState([])

  const [vrProductdata, setVrProductdata] = useState([])
  const [vrPurposedata, setVrPurposedata] = useState([])
  const [vehicleRequestsData, setVehicleRequestsData] = useState([])
  const [vrData, setVrData] = useState([])
  const [gstTaxTermsData, setGstTaxTermsData] = useState([])
  const [tdsTaxTermsData, setTdsTaxTermsData] = useState([])
  const [sapHsnData, setSapHsnData] = useState([])
  const [dvData, setDvData] = useState([])

  useEffect(() => {
    /* section for getting GST Tax Terms Master List For GST Tax Code Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(20).then((response) => {
      console.log(response.data.data, 'setGstTaxTermsData')
      setGstTaxTermsData(response.data.data)
    })

    /* section for getting TDS Tax Terms Master List For TDS Tax Code Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      console.log(response.data.data, 'setTdsTaxTermsData')
      setTdsTaxTermsData(response.data.data)
    })

    /* section for getting Sap Hsn Data from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(27).then((response) => {
      console.log(response.data.data, 'DefinitionsListApi-setSapHsnData')
      setSapHsnData(response.data.data)
    })

    DieselVendorMasterService.getDieselVendors().then((response) => {
      let viewData = response.data.data
      console.log(viewData, 'getDieselVendors')
      setDvData(viewData)
    })
  }, [])

  useEffect(() => {
    /* section for getting VR Lists from database */
    VehicleRequestMasterService.getVehicleRequests().then((res) => {
      let vrList = res.data.data
      console.log(vrList, 'getVehicleRequests')
      let filterData = vrList.filter((data) => data.vr_tr_no == null)
      console.log(filterData, 'getVehicleRequests-filterData')
      setVrData(filterData)
    })

    //section for getting vehicle variety from database
    VehicleVarietyService.getVehicleVariety().then((res) => {
      setVehicleVariety(res.data.data)
    })

    /* section for getting Division Data from database */
    DivisionApi.getDivision().then((rest) => {
      let tableData = rest.data.data
      console.log(tableData)
      setDivisionData(tableData)
    })

    /* section for getting Department Data from database */
    DepartmentApi.getDepartment().then((rest) => {
      setFetch(true)
      let tableData = rest.data.data
      console.log(tableData)
      setDepartmentData(tableData)
    })

    /* section for getting VR Purpose Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(29).then((response) => {
      let viewData = response.data.data
      console.log(viewData, 'VR Purpose Lists')
      setVrPurposedata(viewData)
    })

    /* section for getting VR Product Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(30).then((response) => {
      let viewData = response.data.data
      console.log(viewData, 'VR Product Lists')
      let filter_Data = viewData.filter((data) => data.definition_list_status == 1)
      console.log(filter_Data, 'VR Product Lists - filter_Data')
      setVrProductdata(filter_Data)
    })
  }, [])

  useEffect(() => {
    if (tripInfo && tripInfo.tripsheet_info) {
      console.log(tripInfo.tripsheet_info.vehicle_requests, 'vehicle_requests')

      let veh_req = tripInfo.tripsheet_info.vehicle_requests // 7,8,9

      if (veh_req != null) {
        const formData = new FormData()
        formData.append('vr_string', veh_req)

        ParkingYardGateService.fetchVRList(formData).then((res) => {
          setSmallFetch(true)
          console.log(res, 'fetchVRList')
          let vrlistData = res.data.data
          setVehicleRequestsData(vrlistData)
        })
      } else {
        setSmallFetch(true)
      }
    }
  }, [tripInfo, tripInfo.tripsheet_info])

  /* =========== Others Tripsheet Reworks Part Start ask2=========== */

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
                        <CNavLink active={activeKey === 1} onClick={() => setActiveKey(1)}>
                          General Information
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink active={activeKey === 15} onClick={() => setActiveKey(15)}>
                          Over All Information
                        </CNavLink>
                      </CNavItem>

                      {/* {fg_sales_enable && (
                      <>
                        <CNavItem>
                          <CNavLink
                            active={activeKey === 2}
                            // style={{
                            //   backgroundColor: tabFGSALESHireSuccess ? 'green' : 'red',
                            // }}
                            onClick={() => setActiveKey(2)}
                          >
                            FJ Information
                          </CNavLink>
                        </CNavItem>
                      </>
                    )} */}
                      {/* {sto_enable && tripInfo.tripsheet_info.purpose == '2' && (
                      <>
                        <CNavItem>
                          <CNavLink
                            active={activeKey === 4}
                            // style={{ backgroundColor: tabFGSTOHireSuccess ? 'green' : 'red' }}
                            onClick={() => setActiveKey(4)}
                          >
                            FGSTO Information
                          </CNavLink>
                        </CNavItem>
                      </>
                    )} */}

                      {/* {sto_enable && tripInfo.tripsheet_info.purpose == '3' && (
                      <>
                        <CNavItem>
                          <CNavLink
                            active={activeKey === 8}
                            // style={{ backgroundColor: tabRMSTOHireSuccess ? 'green' : 'red' }}
                            onClick={() => setActiveKey(8)}
                          >
                            RMSTO Information
                          </CNavLink>
                        </CNavItem>
                      </>
                    )} */}

                      {/* <CNavItem>
                      <CNavLink
                        active={activeKey === 7}
                        // style={{ backgroundColor: tabFreightHireSuccess ? 'green' : 'red' }}
                        // disabled={
                        //   !(
                        //     tabFGSALESHireSuccess ||
                        //     (stoTableData && stoTableData.length > 0) ||
                        //     (stoTableDataRMSTO && stoTableDataRMSTO.length > 0)
                        //   )
                        // }
                        onClick={() => setActiveKey(7)}
                      >
                        Freight
                      </CNavLink>
                    </CNavItem> */}
                      {/* {tripInfo.diesel_intent_info && (
                      <CNavItem>
                        <CNavLink
                          active={activeKey === 5}
                          // style={{ backgroundColor: tabFreightHireSuccess ? 'green' : 'red' }}
                          // disabled={
                          //   !(
                          //     tabFGSALESHireSuccess ||
                          //     (stoTableData && stoTableData.length > 0) ||
                          //     (stoTableDataRMSTO && stoTableDataRMSTO.length > 0)
                          //   )
                          // }
                          onClick={() => setActiveKey(5)}
                        >
                          Diesel Information
                        </CNavLink>
                      </CNavItem>
                    )} */}
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
                          // style={{ backgroundColor: tabExpensesHireSuccess ? 'green' : 'red' }}
                          // disabled={!tabFreightHireSuccess}
                          onClick={() => setActiveKey(3)}
                        >
                          Expenses
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink active={activeKey === 13} onClick={() => setActiveKey(13)}>
                          Payment
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                    {/* Hire Vehicles Part Header Tab End */}
                    {/* Hire Vehicles Part Start */}
                    <CTabContent>
                      {/* Hire Vehicle General Info Part Start */}
                      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
                        <CRow className="mt-2">
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="tNum">Tripsheet Number</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="tNum"
                              value={
                                tripInfo && tripInfo.tripsheet_info
                                  ? tripInfo.tripsheet_info.nlmt_tripsheet_no
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
                            <CFormLabel htmlFor="vCap">Vehicle Capacity in MTS</CFormLabel>

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
                            <CFormLabel htmlFor="vType">Vehicle Body Type</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="vType"
                              value={
                                mastersLoaded
                                  ? `${getDefinitionName(
                                    vehicleBody,
                                    tripInfo?.vehicle_info?.vehicle_body_type_id
                                  )}`
                                  : ''
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="dName">Driver Code</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="dName"
                              value={tripInfo?.driver_info?.driver_code}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="dName">Driver Name</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="dName"
                              value={tripInfo?.driver_info?.driver_name}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="dMob">Driver Cell Number</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="dMob"
                              value={tripInfo?.driver_info?.driver_phone_1}
                              readOnly
                            />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="advance_need">Trip Advance Eligibility</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="advance_need"
                              value={
                                tripInfo && tripInfo.tripsheet_info
                                  ? tripInfo.tripsheet_info.advance_request !== 0
                                    ? 'YES'
                                    : 'No'
                                  : ''
                              }
                              readOnly
                            />
                          </CCol>
                          {tripInfo?.advance_payment_info?.advance_payment !== 0 &&
                            tripInfo?.vehicle_info?.vehicle_type_id == 21 && (
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="gateInDateTime">Advance amount</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="gateInDateTime"
                                  value={tripInfo?.advance_payment_info?.advance_payment}
                                  readOnly
                                />
                              </CCol>
                            )}

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="gateInDateTime">Trip-In Date & Time</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="gateInDateTime"
                              value={tripInfo?.tripsheet_info?.ts_creation_time_string}
                              readOnly
                            />
                          </CCol>
                          {!sto_enable && (
                            <CCol xs={12} md={3}>
                              <CFormLabel htmlFor="inspectionDateTime">
                                Vehicle Inspection Date & Time
                              </CFormLabel>

                              <CFormInput
                                size="sm"
                                id="inspectionDateTime"
                                value={
                                  tripInfo?.vehicle_inspection_info
                                    ? tripInfo?.vehicle_inspection_info?.inspection_time_string
                                    : 'No Inspection'
                                }
                                readOnly
                              />
                            </CCol>
                          )}

                          {tripInfo &&
                            tripInfo.vehicle_info &&
                            tripInfo?.vehicle_info?.vehicle_type_id == 22 && (
                              <>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="shedName">Shed Name</CFormLabel>

                                  <CFormInput
                                    size="sm"
                                    id="shedName"
                                    value={
                                      tripInfo.vendor_info
                                        ? tripInfo.vendor_info.shed_info.shed_name
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
                                        ? tripInfo.vendor_info.shed_info.shed_owner_name
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
                                        ? tripInfo.vendor_info.shed_info.shed_owner_phone_1
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
                                      tripInfo.vendor_info ? tripInfo.vendor_info.owner_number : ''
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
                              </>
                            )}
                          {tripInfo && tripInfo.tripsheet_info && (
                            <>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="diffmil">Trip Purpose</CFormLabel>

                                <CFormInput size="sm" id="diffmil" value="FG-Sales" readOnly />
                              </CCol>

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
                                <CFormLabel htmlFor="budgetKM">Budgeted KM</CFormLabel>

                                <CFormInput size="sm" value={tripsettlementData.budgeted_km} readOnly />
                              </CCol>

                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="diffKM">Diff. KM</CFormLabel>

                                <CFormInput size="sm" id="diffKM" value={differenceKMFinder} readOnly />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tripIdleHours">Idle Hrs</CFormLabel>
                                <CFormInput size="sm" value="1" readOnly />
                              </CCol>

                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="budgetMileage">Budgeted Mileage</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  value={tripsettlementData.budgeted_mileage}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="actualMileage">Actual Mileage</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  value={tripsettlementData.actual_mileage}
                                  readOnly
                                />
                              </CCol>

                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="diffmil">Diff. Mileage </CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="diffmil"
                                  value={differenceMileageFinder}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="diffmil">Halt days</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="diffmil"
                                  value={tripsettlementData.halt_days}
                                  readOnly
                                />
                              </CCol>
                            </>
                          )}

                        </CRow>
                        <CRow>
                          {/* {tripInfo && tripInfo.vehicle_info.vehicle_type_id == 22 && (
                          <CCol xs={12} md={9}>
                            {vpanMobile == 0 && (
                              <span style={{ color: 'red' }}>
                                *Vendor Mobile Number was missing / invalid. Kindly update address in SAP..
                              </span>
                            )}
                          </CCol>
                            )} */}
                        </CRow>
                      </CTabPane>
                      {/* Hire Vehicle General Info Part End */}

                      {/* Hire Vehicle Over All Info Part Start */}
                      <CTabPane
                        role="tabpanel"
                        aria-labelledby="profile-tab"
                        visible={activeKey === 15}
                      >
                        {tripInfo.vehicle_assignment && tripInfo.vehicle_assignment.length > 0 && (
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
                                  FG-SALES Information
                                </CFormLabel>
                              </CCol>
                            </CRow>
                            <NlmtFGSALESJourneyInfo
                              fgsalesJourneyInfo={tripInfo.vehicle_assignment}
                              title="FG-Sales Information"
                            />
                            <hr />
                          </>
                        )}


                        {tripInfo.diesel_intent_info && (
                          <>
                            <CRow className="mt-2" hidden>
                              <CCol xs={12} md={3}>
                                <CFormLabel
                                  htmlFor="inputAddress"
                                  style={{
                                    backgroundColor: '#4d3227',
                                    margin: '15px 0',
                                    color: 'white',
                                  }}
                                >
                                  Diesel Information
                                </CFormLabel>
                              </CCol>
                            </CRow>
                            <CRow className="mt-2" hidden style={{ marginBottom: '20px' }}>
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="dVendor">Local Reg. Vendor</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="dVendor"
                                  value={tripInfo.diesel_intent_info ? dieselVendorName : '-'}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="dLtr">Diesel Liter</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="dLtr"
                                  value={
                                    tripInfo.diesel_intent_info
                                      ? tripInfo.diesel_intent_info.no_of_ltrs
                                      : '-'
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
                                      : '-'
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
                                      : '-'
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
                                    <CButton
                                      className="w-100 m-0"
                                      color="info"
                                      size="sm"
                                      id="dInvoice"
                                    >
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
                            {tripsettlementData.enroute_diesel_amount && Number(tripsettlementData.enroute_diesel_amount) > 0 && (
                              <>
                                <CRow className="mt-2" hidden>
                                  <CCol xs={12} md={3}>
                                    <CFormLabel
                                      htmlFor="inputAddress"
                                      style={{
                                        backgroundColor: '#4d3227',
                                        margin: '15px 0',
                                        color: 'white',
                                      }}
                                    >
                                      Enroute Diesel Information
                                    </CFormLabel>
                                  </CCol>
                                </CRow>
                                <CRow className="mt-2" hidden style={{ marginBottom: '20px' }}>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="dVendor">Diesel Vendor</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      id="dVendor"
                                      value={tripsettlementData.enroute_vendor ? tripsettlementData.enroute_vendor : '-'}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="dLtr">Diesel Liter</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      id="dLtr"
                                      value={tripsettlementData.enroute_diesel_liter ? tripsettlementData.enroute_diesel_liter : '-'}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="rateLtr">Rate Per Liter</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type=""
                                      id="rateLtr"
                                      value={tripsettlementData.enroute_diesel_rate ? tripsettlementData.enroute_diesel_rate : '-'}
                                      readOnly
                                    />
                                  </CCol>
                                  <CCol xs={12} md={2}>
                                    <CFormLabel htmlFor="dAmount">Total Amount</CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      id="dAmount"
                                      type=""
                                      value={tripsettlementData.enroute_diesel_amount ? tripsettlementData.enroute_diesel_amount : '-'}
                                      readOnly
                                    />
                                  </CCol>
                                  {/* <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="invoiceDate">Invoice Date & Time</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="invoiceDate"
                                  // type="datetime-local"
                                  value={tripsettlementData.enroute_vendor ? tripsettlementData.enroute_vendor : '-'}
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
                                    <CButton
                                      className="w-100 m-0"
                                      color="info"
                                      size="sm" 
                                      id="dInvoice"
                                    >
                                      <span
                                        className="float-start"
                                        onClick={() => setDieselInvoiceAttachmentVisible(true)}
                                      >
                                        <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                                      </span>
                                    </CButton>
                                  )}
                                </CCol>
                              )} */}
                                </CRow>
                              </>
                            )}
                          </>
                        )}
                        <hr />

                      </CTabPane>

                      {/* Hire Vehicle Over All Info Part End */}

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
                      <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 3}>
                        <CTable caption="top" hover style={{ height: '70vh' }}>
                          <CTableCaption style={{ color: 'maroon' }}>
                            Trip Over All Expenses
                          </CTableCaption>

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
                          <CTableBody>
                            {/* ================== Freight Charges Part Start ======================= */}

                            {tripsettlementData.toll_amount &&
                              tripsettlementData.toll_amount != '0' && (
                                <CTableRow>
                                  <CTableDataCell>Toll Charges</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      value={tripsettlementData.toll_amount}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </CTableRow>
                              )}

                            {/* ================== Freight Charges Part End ======================= */}
                            {/* ================== Low Tonnage Charges Part Start ======================= */}

                            {tripsettlementData.bata &&
                              tripsettlementData.bata != '0' && (
                                <CTableRow>
                                  <CTableDataCell>Driver Bata</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      value={tripsettlementData.bata}
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

                            {tripsettlementData.misc_charges &&
                              tripsettlementData.misc_charges != '0' && (
                                <CTableRow>
                                  <CTableDataCell>Other Charges</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      value={tripsettlementData.misc_charges}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </CTableRow>
                              )}
                            {/* ================== Weighment Charges Part End ======================= */}
                            {/* ================== Halting Charges Part Start ======================= */}

                            {tripsettlementData.loading_charges &&
                              tripsettlementData.loading_charges != '0' && (
                                <CTableRow>
                                  <CTableDataCell>Loading Charges</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      value={tripsettlementData.loading_charges}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </CTableRow>
                              )}

                            {/* ================== Halting Charges Part End ======================= */}

                            {/* ================== Driver Expenses Part Start ============ */}

                            <CTableRow>
                              <CTableDataCell>Total Driver Expense</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput size="sm" value={tripsettlementData.driver_expenses} readOnly />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Driver Expenses Part End ========== */}

                            {/* ================== Home Diesel Charges Part Start ============ */}

                            <CTableRow>
                              <CTableDataCell>Home Diesel Expenses</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput size="sm" value={tripsettlementData.registered_diesel_amount} readOnly />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Home Diesel Charges Part End ========== */}

                            {/* ================== Enroute Diesel Charges Part Start ============ */}
                            {tripsettlementData.enroute_diesel_amount &&
                              Number(tripsettlementData.enroute_diesel_amount) > 0 && (
                                <CTableRow>
                                  <CTableDataCell>Enroute Diesel Expenses</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput size="sm" value={tripsettlementData.enroute_diesel_amount} readOnly />
                                  </CTableDataCell>
                                </CTableRow>
                              )}
                            {/* ================== Enroute Diesel Charges Part End ========== */}

                            {/* ================== Total Charges Part Start ============ */}

                            <CTableRow>
                              <CTableDataCell>Over All Trip Expense</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput size="sm" value={tripsettlementData.expense} readOnly />
                              </CTableDataCell>
                            </CTableRow>
                            {/* ================== Total Charges Part End ========== */}
                          </CTableBody>
                        </CTable>
                        {/* ================== Expense Table Body Part Start ======================= */}

                      </CTabPane>
                      {/* HIre Vehicles Income Capture Start */}
                      <CTabPane
                        role="tabpanel"
                        aria-labelledby="profile-tab"
                        visible={activeKey === 13}
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
                              Expense Request Information :
                            </CFormLabel>
                          </CCol>
                        </CRow>

                        <CRow className="mt-2">
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="remarks">Expense Request Remarks</CFormLabel>
                            <CFormTextarea
                              value={tripsettlementData.remarks ? tripsettlementData.remarks : '-'}
                              readOnly
                            ></CFormTextarea>
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="remarks">Driver Expense Amount</CFormLabel>
                            <CFormInput
                              size='sm'
                              value={tripsettlementData.driver_expenses ? tripsettlementData.driver_expenses : '-'}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="remarks">Expense Request Date & Time</CFormLabel>
                            <CFormInput
                              size='sm'
                              value={tripsettlementData.expense_creation_time ? tripsettlementData.expense_creation_time : '-'}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="remarks">Expense SAP Text</CFormLabel>
                            <CFormInput
                              size='sm'
                              value={tripsettlementData.sap_text ? tripsettlementData.sap_text : '-'}
                              readOnly
                            />
                          </CCol>
                        </CRow>

                        <CRow className="mt-2" hidden>
                          <CCol xs={12} md={3}>
                            <CFormLabel
                              htmlFor="inputAddress"
                              style={{
                                backgroundColor: '#4d3227',
                                color: 'white',
                              }}
                            >
                              Expense Approval Information :
                            </CFormLabel>
                          </CCol>
                        </CRow>

                        <CRow className="mt-2">
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="remarks">Expense Approval Remarks</CFormLabel>
                            <CFormTextarea
                              value={tripsettlementData.expense_approval_remarks ? tripsettlementData.expense_approval_remarks : '-'}
                              readOnly
                            ></CFormTextarea>
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="remarks">SAP Driver Expense Posting Amount</CFormLabel>
                            <CFormInput
                              size='sm'
                              value={tripsettlementData.sap_expense_amount ? tripsettlementData.sap_expense_amount : '-'}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="remarks">Expense Approval Date & Time</CFormLabel>
                            <CFormInput
                              size='sm'
                              value={tripsettlementData.expense_approval_at ? tripsettlementData.expense_approval_at : '-'}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="remarks">SAP Posting Date / Doc. No</CFormLabel>
                            <CFormInput
                              size='sm'
                              value={`${tripsettlementData.sap_expense_date ? tripsettlementData.sap_expense_date : '-'} / ${tripsettlementData.expense_sap_document_no ? tripsettlementData.expense_sap_document_no : '-'}`}
                              readOnly
                            />
                          </CCol>
                        </CRow>

                        <CRow className="mt-2" hidden>
                          <CCol xs={12} md={3}>
                            <CFormLabel
                              htmlFor="inputAddress"
                              style={{
                                backgroundColor: '#4d3227',
                                color: 'white',
                              }}
                            >
                              Driver Payment Information :
                            </CFormLabel>
                          </CCol>
                        </CRow>

                        {/* ================== P&L Body End ======================= */}
                        <CRow className="mt-2">
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="income_remarks">Driver Payment Remarks</CFormLabel>
                            <CFormTextarea
                              name="income_remarks"
                              id="income_remarks"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                              rows="1"
                              value={values.income_remarks}
                            ></CFormTextarea>
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="remarks">Driver Payment Posting Amount</CFormLabel>
                            <CFormInput
                              size='sm'
                              value={tripsettlementData.sap_expense_amount ? tripsettlementData.sap_expense_amount : '-'}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="income_sap_text">Payment SAP Text </CFormLabel>
                            <CFormInput
                              name="income_sap_text"
                              id="income_sap_text"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              maxLength={"30"}
                              onChange={handleChange}
                              rows="1"
                              value={values.income_sap_text}
                            />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="income_posting_date">
                              Payment Posting Date <REQ />{' '}
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="date"
                              id="income_posting_date"
                              name="income_posting_date"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              onChange={handleChange}
                              min={Expense_Income_Posting_Date.min_date}
                              max={Expense_Income_Posting_Date.max_date}
                              onKeyDown={(e) => {
                                e.preventDefault()
                              }}
                              value={values.income_posting_date}
                            />
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
                            <CButton size="sm" color="primary" className="text-white" type="button">
                              <Link className="text-white" to="/NlmtTSPaymentHome">
                                Cancel
                              </Link>
                            </CButton>
                            <CButton
                              size="sm"
                              color="success"
                              className="mx-3 text-white"
                              onClick={() => {
                                setFetch(false)
                                validationApproval()
                              }}
                              type="submit"
                            >
                              Submit
                            </CButton>
                          </CCol>
                        </CRow>
                      </CTabPane>
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
                    {tripInfo?.vehicle_info?.vehicle_type_id &&
                      tripInfo?.vehicle_info?.vehicle_type_id === 21 && (
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
                    {tripInfo?.vehicle_info?.vehicle_type_id &&
                      tripInfo?.vehicle_info?.vehicle_type_id !== 22 && (
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

export default NlmtTSPayment
