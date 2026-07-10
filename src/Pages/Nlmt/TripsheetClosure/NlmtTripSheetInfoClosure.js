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

import StoTableComponent from './StoTableComponent'
import AllDriverListNameSelectComponent from 'src/components/commoncomponent/AllDriverListNameSelectComponent'
import StoTableRMSTOComponent from './StoTableRMSTOComponent'
import CustomTable from 'src/components/customComponent/CustomTable'
import ExpenseCalculations from './Calculations/NlmtExpenseCalculations'
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
import ExpenseIncomePostingDate from './Calculations/NlmtExpenseIncomePostingDate'

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
import NlmtRMSTOJourneyInfo from './JourneyInfo/NlmtRMSTOJourneyInfo'
import NlmtRakeJourneyInfo from './JourneyInfo/NlmtRakeJourneyInfo'
import NlmtOthersJourneyInfo from './JourneyInfo/NlmtOthersJourneyInfo'
import NlmtFGSALESJourneyInfo from './JourneyInfo/NlmtFGSALESJourneyInfo'
import NlmtFCIJourneyInfo from './JourneyInfo/NlmtFCIJourneyInfo'
import NlmtRJSaleOrderCreationService from 'src/Service/Nlmt/RJSaleOrderCreation/NlmtRJSaleOrderCreationService'
import NlmtVehicleAssignmentService from 'src/Service/Nlmt/VehicleAssignment/NlmtVehicleAssignmentService'
import NlmtDefinitionsListApi from 'src/Service/Nlmt/Masters/NlmtDefinitionsListApi'
import NlmtTripSheetClosureSapService from 'src/Service/Nlmt/SAP/NlmtTripSheetClosureSapService'

const NlmtTripSheetInfoClosure = () => {
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
  let page_no = NlmtScreenAccessCodes.NlmtClosureScreens.Nlmt_Income_Closure

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

  const tripPurposeFinder = (code) => {
    let p_code = '-'
    if (code == '1') {
      p_code = 'FG-SALES'
    } else if (code == '2') {
      p_code = 'FG-STO'
    } else if (code == '3') {
      p_code = 'RM-STO'
    } else if (code == '4') {
      p_code = 'OTHERS'
    } else if (code == '5') {
      p_code = 'FCI'
    }
    return p_code
  }

  const convertJsonSTringify = (data) => {
    // reCreate new Object and set File Data into it
    var newObject = {
      lastModified: data.lastModified,
      lastModifiedDate: data.lastModifiedDate,
      name: data.name,
      size: data.size,
      type: data.type,
    }

    // return newObject

    // // then use JSON.stringify on new object
    // JSON.stringify(newObject)

    // var dataArray = JSON.parse(JSON.stringify(data))
    // // implement toJSON() behavior
    // dataArray.toJSON = function () {
    //   return {
    //     lastModified: dataArray.lastModified,
    //     lastModifiedDate: dataArray.lastModifiedDate,
    //     name: dataArray.name,
    //     size: dataArray.size,
    //     type: dataArray.type,
    //   }
    // }

    // then use JSON.stringify on File object
    // JSON.stringify(fileObject)

    // return JSON.stringify(dataArray)
    // return dataArray

    return JSON.stringify(newObject)
  }

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

  const baseFreightCalculation = (data, ind = '') => {
    // console.log(data)
    let shipment = data.shipment_child_info
    let shipment_freight = 0
    let shipment_splitted_info = JSON.parse(JSON.stringify(shipmentInfo))
    let totalQty = 0
    shipment.map((delivery_1, index_1) => {
      // if(delivery_1.delivery_status == '3' && delivery_1.delivery_plant == '9290') {
      if (
        delivery_1.delivery_status == '3' &&
        JavascriptInArrayComponent(delivery_1.delivery_plant, nlcdPlantsArrayData)
      ) {
        totalQty += Number(parseFloat(delivery_1.delivery_qty).toFixed(4))
      }
    })

    shipment.map((delivery, index) => {
      if (
        delivery.delivery_freight_amount == '1' &&
        !(delivery.inco_term_id == '381' || delivery.inco_term_id == '382')
      ) {
        let uom_data = delivery.invoice_uom
        // if(delivery.delivery_plant != '9290'){
        if (!JavascriptInArrayComponent(delivery.delivery_plant, nlcdPlantsArrayData)) {
          uom_data = delivery.billed_uom != null ? delivery.billed_uom : delivery.invoice_uom
        }

        let freight_needed = calculationForFreight(
          shipment,
          delivery.delivery_qty,
          delivery.customer_info.CustomerCode,
          delivery.delivery_plant,
          uom_data,
          data.created_at,
          totalQty
        )
        console.log(freight_needed, 'freight_needed')

        shipment_freight += Number(parseFloat(freight_needed).toFixed(2))
      } else {
        shipment_freight += Number(parseFloat(delivery.delivery_freight_amount).toFixed(2))
      }
    })

    if (ind == 'test') {
      console.log(shipment_freight, 'shipment_freight')
      data.shipment_freight_amount_db = shipment_freight
    }

    return shipment_freight
  }

  const baseFreightNullCalculation = (data) => {
    let test_key = 1
    console.log(data, 'baseFreightNullCalculationData')
    let shipment = data.shipment_child_info
    let shipment_freight = 0
    shipment.map((delivery, index) => {
      if (
        delivery.delivery_freight_amount == '1' &&
        !(delivery.inco_term_id == '381' || delivery.inco_term_id == '382')
      ) {
        console.log(delivery, 'baseFreightNullCalculationdelivery')
        let uom_data = delivery.invoice_uom
        // if(delivery.delivery_plant != '9290'){
        if (!JavascriptInArrayComponent(delivery.delivery_plant, nlcdPlantsArrayData)) {
          uom_data = delivery.billed_uom != null ? delivery.billed_uom : delivery.invoice_uom
        }
        let freight_needed = calculationForFreight(
          shipment,
          delivery.delivery_qty,
          delivery.customer_info.CustomerCode,
          delivery.delivery_plant,
          uom_data,
          data.created_at
        )
        console.log(freight_needed, 'baseFreightNullCalculationfreight_needed1')
        if (freight_needed == '0') {
          test_key = 0
        }
      }
    })
    console.log(shipment_freight, 'baseFreightNullCalculationfreight_needed2')
    return test_key
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

  const calculationForFreight = (deliveries, qty, code, plant, uom, date, t_qty = 0) => {
    let freight = 0
    let location = ''

    // if(plant == '9290'){
    //   location = 8
    // } else if(plant == '1009' || plant == '1010'){
    //   location = 1
    // } else if(plant == '1020' || plant == '1022'){
    //   location = 6
    // }

    let locationFilterData = locationData.filter((data) => data.location_code == plant)

    console.log(locationFilterData, 'locationFilterData')
    if (locationFilterData.length > 0) {
      location = locationFilterData[0].id
    }

    console.log(code, 'code')
    console.log(plant, 'plant')
    console.log(uom, 'uom')
    console.log(tripShipmentCustomerData, 'tripShipmentCustomerData')

    var delivery_freight_array = []

    deliveries.forEach((datan1, indexn1) => {
      // if(datan1.delivery_plant == '9290'){
      if (JavascriptInArrayComponent(datan1.delivery_plant, nlcdPlantsArrayData)) {
        tripShipmentCustomerData.map((data1, index1) => {
          if (data1.customer_code == datan1.customer_info.CustomerCode) {
            let freight_filter_info = []
            if (data1.freight_info && data1.freight_info.length > 0) {
              console.log(data1.freight_info, 'data1.freight_info')
              freight_filter_info = data1.freight_info.filter(
                (data) => data.location_id == location
              )
            }
            console.log(freight_filter_info, 'freight_filter_info')
            freight_filter_info.map((data2, index2) => {
              if (
                data2.type == uom &&
                dateCheck(data2.formated_start_date, data2.formated_end_date, date)
              ) {
                //&& data2.freight_status == '1'
                delivery_freight_array.push(data2.freight_rate)
              }
            })
          }
        })
      }
    })

    /* Get Highest Delivery Freight From deliveryFreightData*/
    console.log(delivery_freight_array, 'delivery_freight_array')

    var largest = 0

    for (let i = 0; i < delivery_freight_array.length; i++) {
      if (delivery_freight_array[i] > largest) {
        largest = delivery_freight_array[i]
      }
    }

    console.log(largest, 'largest freight')

    tripShipmentCustomerData.map((data1, index1) => {
      if (data1.customer_code == code) {
        let freight_filter_info1 = []
        if (data1.freight_info && data1.freight_info.length > 0) {
          console.log(data1.freight_info, 'data1.freight_info1')
          freight_filter_info1 = data1.freight_info.filter((data) => data.location_id == location)
        }
        console.log(freight_filter_info1, 'freight_filter_info1')

        freight_filter_info1.map((data2, index2) => {
          if (
            data2.type == uom &&
            dateCheck(data2.formated_start_date, data2.formated_end_date, date)
          ) {
            // && data2.freight_status == '1') {
            if (location == '8') {
              freight = Number(parseFloat(largest).toFixed(2)) * Number(parseFloat(qty).toFixed(4))
            } else {
              freight =
                Number(parseFloat(data2.freight_rate).toFixed(2)) *
                Number(parseFloat(qty).toFixed(4))
            }
          }
        })
      }
    })

    console.log(freight, 'freight')

    return freight
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

    let pl = parseFloat(income-expense).toFixed(2)

    return pl

  } 

  const uomName = (id) => {
    if (id == 1) {
      return 'TON'
    } else if (id == 2) {
      return 'KG'
    } else {
      return ''
    }
  }

  const paymentName = (mode) => {
    if (mode == 1) {
      return 'Cash Payment'
    } else if (mode == 2) {
      return 'Debit Card'
    } else if (mode == 3) {
      return 'Credit Card'
    } else if (mode == 4) {
      return 'GPay'
    } else if (mode == 5) {
      return 'Phone Pay'
    } else if (mode == 6) {
      return 'Paytm'
    }
  }

  useEffect(() => {
    const val_obj = Object.entries(values)

    val_obj.forEach(([key_st, value]) => {})
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
        console.log(settlementRes,'settlementRes')
        console.log(shipmentRes,'shipmentRes')
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

  const vendorDataAssignment = (resp_data) => {
    let vcode = 0
    if (resp_data.Parking_Vendor_Info) {
      vcode = resp_data.Parking_Vendor_Info.vendor_code
    } else {
      vcode = resp_data.vendor_info != null ? resp_data.vendor_info.vendor_code : ''
    }
    if (vcode == 0 || vcode == '') {
      setVpan('')
    } else {
      let vp =
        resp_data?.Parking_Vendor_Info?.pan_card_number || resp_data?.vendor_info?.pan_card_number
      console.log(vp, 'vendorDataAssignment-vp')
      setVpan(vp)
    }
  }

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

  const changeVadTableItem = (event, child_property_name, parent_index, child_index) => {
    let getData = event.target.value
    console.log(getData, 'getData')

    if (child_property_name == 'unloading_charges') {
      getData = event.target.value.replace(/\D/g, '')
    }

    const shipment_parent_info = JSON.parse(JSON.stringify(shipmentInfo))

    shipment_parent_info[parent_index].shipment_child_info[child_index][
      `${child_property_name}_input`
    ] = getData

    if (child_property_name !== 'defect_type') {
      shipment_parent_info[parent_index].shipment_child_info[child_index][
        `${child_property_name}_validated`
      ] = !!getData
    }

    console.log(shipment_parent_info)
    setShipmentInfo(shipment_parent_info)
  }

  const changeVadHireTableItem = (event, child_property_name, parent_index, child_index) => {
    let getData01 = event.target.value
    console.log(getData01, 'getData')

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

    console.log(shipment_hire_parent_info)
    setShipmentInfo(shipment_hire_parent_info)
  }

  console.log(shipmentInfo)

  const vadHireDataUpdate = (original, input) => {
    return original === undefined ? input : original
  }

  const vadDataUpdate = (original, input) => {
    // return input === undefined ? original : input
    return input === undefined ? original : input
  }

  const s_to_n = (string) => {
    return Number(string)
  }

  /* ===================== Vehicle Assignment Details Table Data Part End ===================== */

  /* ================= Vehicle Assignment Details Table Income Capture Part Start ============= */

  const onlyNumberKey = (evt) => {
    console.log(evt, 'evt')
    // Only ASCII character in that range allowed
    var ASCIICode = evt.which ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false
    return true
  }

  const total_trip_freight = (data, type) => {
    // prototype

    console.log(data, 'total_freight')

    var income_halting_charges1 = data.income_halting_charges_input
      ? Number(data.income_halting_charges_input)
      : 0
    var income_sub_delivery_charges1 = data.income_sub_delivery_charges_input
      ? Number(data.income_sub_delivery_charges_input)
      : 0
    var income_unloading_charges1 = data.income_unloading_charges_input
      ? Number(data.income_unloading_charges_input)
      : 0
    var income_weighment_chares1 = data.income_weighment_chares_input
      ? Number(data.income_weighment_chares_input)
      : 0
    var income_low_tonage_charges1 = data.income_low_tonage_charges_input
      ? Number(data.income_low_tonage_charges_input)
      : 0
    var income_toll_charges1 = data.income_toll_charges_input
      ? Number(data.income_toll_charges_input)
      : 0
    var income_others_charges1 = data.income_others_charges_input
      ? Number(data.income_others_charges_input)
      : 0

    var freight_amount1 = 0

    if (type == 'fgsales') {
      freight_amount1 = baseFreightCalculation(data, 'test')
      // freight_amount1 = data.shipment_freight_amount ? Number(data.shipment_freight_amount) : 0
    } else if (type == 'rjso') {
      freight_amount1 = data.freight_income ? Number(data.freight_income) : 0
    } else if (type == 'sto') {
      freight_amount1 = data.freight_amount ? Number(data.freight_amount) : 0
    } else if (type == 'others_sto') {
      freight_amount1 = data.freight_amount ? Number(data.freight_amount) : 0
    }

    let total_data1 =
      income_halting_charges1 +
      income_sub_delivery_charges1 +
      income_unloading_charges1 +
      income_weighment_chares1 +
      income_low_tonage_charges1 +
      income_toll_charges1 +
      income_others_charges1 +
      freight_amount1

    console.log(total_data1, 'total_data1')
    return total_data1
  }

  const total_trip_settlement_freight = (data, type) => {
    // prototype

    console.log(data, 'total_freight')

    var income_halting_charges1 = data.income_halting_charges
      ? Number(data.income_halting_charges)
      : 0
    var income_sub_delivery_charges1 = data.income_sub_delivery_charges
      ? Number(data.income_sub_delivery_charges)
      : 0
    var income_unloading_charges1 = data.income_unloading_charges
      ? Number(data.income_unloading_charges)
      : 0
    var income_weighment_chares1 = data.income_weighment_chares
      ? Number(data.income_weighment_chares)
      : 0
    var income_low_tonage_charges1 = data.income_low_tonage_charges
      ? Number(data.income_low_tonage_charges)
      : 0
    var income_others_charges1 = data.income_others_charges ? Number(data.income_others_charges) : 0

    var freight_amount1 = 0

    if (type == 'fgsales') {
      freight_amount1 = data.shipment_freight_amount ? Number(data.shipment_freight_amount) : 0
    } else if (type == 'rjso') {
      freight_amount1 = data.freight_income ? Number(data.freight_income) : 0
    } else if (type == 'sto') {
      freight_amount1 = data.freight_amount ? Number(data.freight_amount) : 0
    }

    let total_data1 =
      income_halting_charges1 +
      income_sub_delivery_charges1 +
      income_unloading_charges1 +
      income_weighment_chares1 +
      income_low_tonage_charges1 +
      income_others_charges1 +
      freight_amount1

    console.log(total_data1, 'total_data1')
    return total_data1
  }

  const changeVadTableItemForIncome = (event, child_property_name, parent_index) => {
    let getData = event.target.value
    console.log(parent_index, 'parent_index')
    console.log(getData, 'getData')

    getData = event.target.value.replace(/\D/g, '')

    const shipment_parent_income_info = JSON.parse(JSON.stringify(shipmentInfo))

    shipment_parent_income_info[parent_index][`${child_property_name}_input`] = getData

    shipment_parent_income_info[parent_index][`total_freight`] = total_trip_freight(
      shipment_parent_income_info[parent_index],
      'fgsales'
    )

    if (child_property_name !== 'defect_type') {
      shipment_parent_income_info[parent_index][`${child_property_name}_validated`] = !!getData
    }

    // var ant = ''
    console.log(
      shipment_parent_income_info[parent_index].vehicle_type_id,
      'shipment_parent_income_info[parent_index].vehicle_type_id'
    )
    if (shipment_parent_income_info[parent_index].vehicle_type_id == '21') {
      var ant = document.getElementById(`shipment_hire_fgsales_freight_${parent_index}`)
    } else {
      var ant = document.getElementById(`shipment_own_fgsales_freight_${parent_index}`)
    }

    ant.value = shipment_parent_income_info[parent_index][`total_freight`]

    // console.log(ant,'freight_value')

    console.log(shipment_parent_income_info)
    setShipmentInfo(shipment_parent_income_info)
  }

  // const changeVadHireTableItem = (event, child_property_name, parent_index, child_index) => {
  //   let getData01 = event.target.value
  //   console.log(getData01, 'getData')

  //   if (child_property_name == 'unloading_charges') {
  //     getData01 = event.target.value.replace(/\D/g, '')
  //   }

  //   const shipment_hire_parent_info = JSON.parse(JSON.stringify(shipmentInfo))

  //   shipment_hire_parent_info[parent_index].shipment_child_info[child_index][
  //     `${child_property_name}_input`
  //   ] = getData01

  //   if (child_property_name !== 'defect_type') {
  //     shipment_hire_parent_info[parent_index].shipment_child_info[child_index][
  //       `${child_property_name}_validated`
  //     ] = !!getData01
  //   }

  //   console.log(shipment_hire_parent_info)
  //   setShipmentInfo(shipment_hire_parent_info)
  // }

  console.log(shipmentInfo)

  // const vadHireDataUpdate = (original, input) => {
  //   return original === undefined ? input : original
  // }

  const vadDataUpdateforIncome = (original, input) => {
    // return input === undefined ? original : input
    return input === undefined ? original : input
  }

  /* ===================== Vehicle Assignment Details Table Income Capture Part End ===================== */

  /* ===================== RJSO Table Income Capture Part Start ===================== */

  const changeRjsoTableItemForIncome = (event, child_property_name, parent_index) => {
    let getData = event.target.value
    console.log(getData, 'getData')

    getData = event.target.value.replace(/\D/g, '')

    const rjso_parent_income_info = JSON.parse(JSON.stringify(rjsoInfo))

    rjso_parent_income_info[parent_index][`${child_property_name}_input`] = getData

    rjso_parent_income_info[parent_index][`total_freight`] = total_trip_freight(
      rjso_parent_income_info[parent_index],
      'rjso'
    )

    if (child_property_name !== 'defect_type') {
      rjso_parent_income_info[parent_index][`${child_property_name}_validated`] = !!getData
    }

    var ant1 = document.getElementById(`trip_rjso_freight_${parent_index}`)
    ant1.value = rjso_parent_income_info[parent_index][`total_freight`]

    const prices_rjso = document.querySelectorAll('*[id^="trip_rjso_freight_"]')
    console.log(prices_rjso, 'prices')

    // console.log(ant,'freight_value')

    console.log(rjso_parent_income_info)

    setRjsoInfo(rjso_parent_income_info)
  }

  const rjsoDataUpdateforIncome = (original, input) => {
    // return input === undefined ? original : input
    return input === undefined ? original : input
  }

  const [rjCustomerData, setRjCustomerData] = useState([])

  /* section for getting RJ Customer Details from database */
  useEffect(() => {
    CustomerCreationService.getCustomerCreationData().then((res) => {
      console.log(res.data.data, 'setRjCustomerData')
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
    console.log(code)
    console.log(rjCustomerData)
    return customer_name
  }

  /* ===================== RJSO Table Income Capture Part End ===================== */

  /* ===================== STO Table Income Capture Part Start ===================== */

  const changeStoTableItemForIncome = (event, child_property_name, parent_index) => {
    let getData = event.target.value
    console.log(getData, 'getData')

    getData = event.target.value.replace(/\D/g, '')

    const sto_parent_income_info = JSON.parse(JSON.stringify(tripStoData))

    console.log(sto_parent_income_info[parent_index])
    sto_parent_income_info[parent_index][`${child_property_name}_input`] = getData

    sto_parent_income_info[parent_index][`total_freight`] = total_trip_freight(
      sto_parent_income_info[parent_index],
      'sto'
    )

    if (child_property_name !== 'defect_type') {
      sto_parent_income_info[parent_index][`${child_property_name}_validated`] = !!getData
    }

    var ant_sto = ''

    if (sto_parent_income_info[parent_index].sto_delivery_type == '1') {
      /* FGSTO Process */
      ant_sto =
        sto_parent_income_info[parent_index].trip_driver_id == ''
          ? document.getElementById(`trip_hire_fgsto_freight_${parent_index}`)
          : document.getElementById(`trip_own_fgsto_freight_${parent_index}`)
    } else if (sto_parent_income_info[parent_index].sto_delivery_type == '2') {
      /* RMSTO Process */
      ant_sto =
        sto_parent_income_info[parent_index].trip_driver_id == ''
          ? document.getElementById(`trip_hire_rmsto_freight_${parent_index}`)
          : document.getElementById(`trip_own_rmsto_freight_${parent_index}`)
    } else if (sto_parent_income_info[parent_index].sto_delivery_type == '4') {
      /* FCI Process */
      ant_sto = document.getElementById(`trip_own_fci_freight_${parent_index}`)
    }

    // console.log(sto_parent_income_info[parent_index][`total_freight`], 'ant_sto value')
    // var ant_sto = document.getElementById(`trip_sto_freight_${parent_index}`)
    ant_sto.value = sto_parent_income_info[parent_index][`total_freight`]

    const prices_sto = document.querySelectorAll('*[id^="trip_sto_freight_"]')

    console.log(ant_sto, 'ant_sto')
    console.log(prices_sto, 'prices')

    // console.log(ant,'freight_value')

    console.log(sto_parent_income_info)

    setTripStoData(sto_parent_income_info)
  }

  const stoDataUpdateforIncome = (original, input) => {
    // return input === undefined ? original : input
    return input === undefined ? original : input
  }

  /* ===================== STO Table Income Capture Part End ===================== */

  /* ===================== RJSO Creation Table Data Part Start ===================== */

  const changeRjsoTableItem = (event, child_property_name, parent_index) => {
    let getData1 = event.target.value

    console.log(event, 'event')
    console.log(event.target, 'event.target')
    console.log(getData1)

    if (event.target.type === 'file') {
      // getData1 = event.target.files[0]
      getData1 = convertJsonSTringify(event.target.files[0])
    }

    if (child_property_name == 'unloading_charges') {
      getData1 = event.target.value.replace(/\D/g, '')
    }

    const rjso_parent_info = JSON.parse(JSON.stringify(rjsoInfo))

    rjso_parent_info[parent_index][`${child_property_name}_input`] = getData1

    if (child_property_name !== 'defect_type') {
      rjso_parent_info[parent_index][`${child_property_name}_validated`] = !!getData1
    }

    console.log(rjso_parent_info)
    setRjsoInfo(rjso_parent_info)
  }

  // console.log(rjsoInfo)

  const rjsoDataUpdate = (original, input) => {
    return input === undefined ? original : input
  }

  const rjsoRadioDataUpdate = (original, input, val) => {
    return input === undefined ? original : input ? input : val
  }

  /* ===================== RJSO Creation Table Data Part End ===================== */

  const JourneyInfoExists = (type, data) => {
    // console.log(data,'JourneyInfoExists-data')
    let condition_code1 = 0
    let condition_code2 = 0
    let condition_code3 = 0
    data.map((ll, jj) => {
      let sto_do_type = ll.sto_delivery_type
      let sto_rm_type = ll.rm_type
      if (type == 1 && (sto_do_type == 1 || (sto_do_type == 2 && sto_rm_type == 1))) {
        condition_code1 = 1
      } else if (type == 2 && sto_do_type == 2 && sto_rm_type == 2) {
        condition_code2 = 1
      } else if (type == 3 && sto_do_type == 4) {
        condition_code3 = 1
      }
    })

    console.log(type, 'JourneyInfoExists-type')
    console.log(condition_code1, 'JourneyInfoExists-condition_code1')
    console.log(condition_code2, 'JourneyInfoExists-condition_code2')
    console.log(condition_code3, 'JourneyInfoExists-condition_code3')
    if (
      (type == 1 && condition_code1 == 1) ||
      (type == 2 && condition_code2 == 1) ||
      (type == 3 && condition_code3 == 1)
    ) {
      return true
    }

    return false
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

  const onChangeFgsalesExpenseItem = (event, property_name, parent_index) => {
    let getData5 = event.target.value.replace(/\D/g, '')

    const fgsales_expenses_parent_info = JSON.parse(JSON.stringify(shipmentInfo))

    fgsales_expenses_parent_info[parent_index][property_name] = getData5
    setShipmentInfo(fgsales_expenses_parent_info)
    console.log(fgsales_expenses_parent_info)
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
    console.log(rjsoInfo)
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

  const fgstoaddonTabEnableCheck = (e) => {
    let availability_fgsto = e.target.value
    setfgsto_TripAddonAvailability(availability_fgsto)
    console.log(availability_fgsto)
    console.log(tabFGSTOSuccess, 'tabFGSTOSuccess')
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

    console.log(updatedURVInputs.urvDieselLiter)
    console.log(updatedURVInputs.urvDieselRate)
    console.log(urvTotalAmountFinder)

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

    // if (
    //   urvTotalAmountFinder != 0 &&
    //   updatedURVInputs.urvDieselLiter &&
    //   updatedURVInputs.urvDieselRate
    // ) {
    //   console.log('123')
    //   totalDieselInfoCalculationAfterEnrouteDiesel(
    //     updatedURVInputs.urvDieselLiter,
    //     updatedURVInputs.urvDieselRate,
    //     urvTotalAmountFinder
    //   )
    // } else {
    //   console.log('456')
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

  const getFileName = (path) => {
    let ind_no = path.lastIndexOf('/')
    let parent = path.substring(ind_no + 1)

    return parent
  }

  const totalDieselInfoCalculation = (collection_data) => {
    console.log(dieselCollectionInfo)
    let Total_Diesel_Liter = 0
    let Total_Rate_Per_Liter = 0
    let Total_Diesel_Amount = 0

    let needed_data = []
    needed_data.push(dieselCollectionInfo)
    console.log(needed_data)
    needed_data.map((datan, index1) => {
      datan.map((data, index) => {
        console.log(data.no_of_ltrs, 'no_of_ltrs', index)
        console.log(data.rate_of_ltrs, 'rate_of_ltrs', index)
        console.log(data.total_amount, 'total_amount', index)
        Total_Diesel_Liter = Total_Diesel_Liter + Number(data.no_of_ltrs)
        Total_Rate_Per_Liter = Total_Rate_Per_Liter + Number(data.rate_of_ltrs)
        Total_Diesel_Amount = Total_Diesel_Amount + Number(data.total_amount)
      })
    })

    setTdlDieselInfo(Total_Diesel_Liter)
    setArplDieselInfo(Total_Rate_Per_Liter / dieselCollectionInfo.length)
    setTdaDieselInfo(Total_Diesel_Amount)
    console.log(Total_Diesel_Liter)
    console.log(Total_Rate_Per_Liter)
    console.log(Total_Diesel_Amount)

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
    console.log(rvTotalValues)
    let Total_Diesel_Liter1 = rvTotalValues.rvTotalDieselLiter + Number(liter)
    let Total_Rate_Per_Liter1 = (rvTotalValues.rvAverageRatePerLiter + Number(rate)) / 2
    let Total_Diesel_Amount1 = rvTotalValues.rvTotalDieselAmount + Number(amount)

    // let needed_data = []
    // needed_data.push(dieselCollectionInfo)
    // console.log(needed_data)
    // needed_data.map((datan, index1) => {
    //   datan.map((data, index) => {
    //     console.log(data.no_of_ltrs, 'no_of_ltrs', index)
    //     console.log(data.rate_of_ltrs, 'rate_of_ltrs', index)
    //     console.log(data.total_amount, 'total_amount', index)
    //     Total_Diesel_Liter1 = Total_Diesel_Liter1 + Number(data.no_of_ltrs)
    //     Total_Rate_Per_Liter1 = Total_Rate_Per_Liter1 + Number(data.rate_of_ltrs)
    //     Total_Diesel_Amount1 = Total_Diesel_Amount1 + Number(data.total_amount)
    //   })
    // })

    console.log(Total_Diesel_Liter1)
    console.log(Total_Rate_Per_Liter1)
    console.log(Total_Diesel_Amount1)

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
    console.log(stoValues.sto_pod_copy)
    stoValues.sto_pod_copy = ''
    setStoFileUploadVisible(true)
  }

  const onStoEditcallback = (index) => {
    setStoDeliveryEdit(true)
    setIsStoEditMode(true)
    console.log(index)
    console.log(deliveryNoDelete)
    setStoEditIndex(index)
    setStoFileUploadVisible(false)
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
    console.log(index)
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
      console.log(stoTableData, 'after stoTableData update/edit')
    } else {
      toast.warning('Please Fill All The Required Fields..')
    }
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

  const enable_Submit_check = () => {
    if (errors.driver_balance_received) {
      return true
    }
    return false
  }
  const handleStoExpenseCaptureChange = (event) => {
    let updatedinputs = { ...stoValues, [event.target.name]: event.target.checked }
    setStoValues(updatedinputs)
    console.log(stoValues)
    console.log(stoTableData)
  }

  const assignSTOData = (sap) => {
    console.log(sap)
    toast.success('STO Delivery Details Detected!')
    let updatedinputs = {}
    // let stoSapData = {
    //   ['sto_po_number']: sap.SIGNI,
    //   ['sto_delivery_division']: sap.DIVISION,
    //   ['sto_from_location']: sap.RESWK,
    //   ['sto_to_location']: sap.WERKS,
    //   ['sto_delivery_quantity']: sap.LFIMG,
    //   ['sto_freight_amount']: sap.KBETR,
    // }

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
    // updatedinputs = { ...stoValues, sto_delivery_division }
    // updatedinputs = { ...stoValues, sto_from_location }
    // updatedinputs = { ...stoValues, sto_to_location }
    // updatedinputs = { ...stoValues, sto_delivery_quantity }
    // updatedinputs = { ...stoValues, sto_freight_amount }

    console.log(updatedinputs)
    // stoValues.push(stoSapData)
    setStoValues(updatedinputs)
    addEnable(updatedinputs)
  }

  const handleStoFileUploadChange = (event) => {
    console.log(event.target)
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
    setStoFileUploadVisibleRMSTO(true)
    setStoValuesRMSTO(TripsheetClosureConstants.stoInitialStateRMSTO)
  }

  const stoResetEditRMSTO = () => {
    setIsStoEditModeRMSTO(false)
    setStoEditIndexRMSTO(-1)
    setStoFileUploadVisibleRMSTO(true)
    setStoValuesRMSTO(TripsheetClosureConstants.stoInitialStateRMSTO)
  }

  const stoPodUploadResetEditRMSTO = () => {
    console.log(stoValuesRMSTO.sto_pod_copy_rmsto)
    stoValuesRMSTO.sto_pod_copy_rmsto = ''
    setStoFileUploadVisibleRMSTO(true)
  }

  const onStoEditcallbackRMSTO = (index) => {
    setIsStoEditModeRMSTO(true)
    console.log(index)
    console.log(deliveryNoDeleteRMSTO)
    setStoEditIndexRMSTO(index)
    setStoFileUploadVisibleRMSTO(false)
    setStoValuesRMSTO(stoTableDataRMSTO[index])
  }

  const removeStoFieldsRMSTO = (index) => {
    setDeliveryDeleteRMSTO(false)
    const updatedData = [...stoTableDataRMSTO]
    updatedData.splice(index, 1)
    setStoTableDataRMSTO(updatedData)
    setDeliveryNoDeleteRMSTO('')
    setDeliveryNoDeleteIndexRMSTO('')
  }

  const onStoDeleteCallbackRMSTO = (index) => {
    console.log(index)
    setDeliveryNoDeleteRMSTO(stoTableDataRMSTO[index].sto_delivery_number_rmsto)
    setDeliveryNoDeleteIndexRMSTO(index)
    setDeliveryDeleteRMSTO(true)
  }

  const onStoSubmitBtnRMSTO = () => {
    let updatedTable = []
    console.log(stoValuesRMSTO)
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
      console.log(stoTableDataRMSTO, 'after stoTableDataRMSTO update/edit')
    } else {
      toast.warning('Please Fill All The Required Fields..')
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

  /* ====== Diesel Consumption Ltr (Aprox.) & Runnnig KM Calculation Part Start ===== */

  const stoJourneyTypeFinder = (data) => {
    let j_type = 'DEF'
    if (data.sto_delivery_type == '1') {
      j_type = 'FG-STO'
    } else if (data.sto_delivery_type == '4') {
      j_type = 'FCI'
    } else {
      if (data.rm_type == '2') {
        j_type = 'RAKE'
      } else {
        j_type = 'RM-STO'
      }
    }
    return j_type
  }

  const stoDivisionFinder = (data) => {
    let div = ''
    if (data.sto_delivery_division == 'CONSUMER') {
      div = 'NLMT'
    } else if (data.sto_delivery_division == 'MMD') {
      div = 'MMD'
    } else {
      div = 'NLMT'
    }
    return div
  }

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

    // console.log(shipment_parent_info)

    setShipmentInfo(fgsales_parent_info)
  }

  console.log(tabFGSTOSuccess, 'tabFGSTOSuccess')
  console.log(shipmentInfo)

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

    // console.log(shipment_parent_info)
    setRjsoInfo(rjso_parent_info)
  }

  console.log(rjsoInfo)

  const rjsoDataUpdateForDCC = (original, input) => {
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

  console.log(stoTableData)

  const fgstoDataUpdateForDCC = (original, input) => {
    return input === undefined ? original : input
  }

  /*============= Advance Clearance Calculation Part Start ===================*/

  const driver_expense_calculation = () => {
    let driver_expense = 0
    if (tripsettlementData.enroute_payment == '2') {
      driver_expense =
        Number(tripsettlementData.expense) -
        (Number(tripsettlementData.fasttag_toll_amount) +
          Number(tripsettlementData.registered_diesel_amount) +
          Number(tripsettlementData.enroute_diesel_amount))
    } else {
      driver_expense =
        Number(tripsettlementData.expense) -
        (Number(tripsettlementData.fasttag_toll_amount) +
          Number(tripsettlementData.registered_diesel_amount))
    }
    // return parseFloat(Number(driver_expense)).toFixed(2)
    return driver_expense
  }

  const rj_receipt_amount_calculation = () => {
    console.log(rjsoInfo)
    let rj_amount = 0
    rjsoInfo.map((da, ins) => {
      if (da.balance_payment_received_input == '1' || da.balance_payment_received == '1') {
        if (da.advance_payment_mode == '1') {
          rj_amount += Number(da.advance_amount)
        }

        if (da.balance_payment_mode_input) {
          if (da.balance_payment_mode_input == '1') {
            rj_amount += Number(da.balance_amount)
          }
        } else if (da.balance_payment_mode == '1') {
          rj_amount += Number(da.balance_amount)
        }
      } else {
        if (da.advance_payment_mode == '1') {
          rj_amount += Number(da.advance_amount)
        }
      }
    })
    console.log(rj_amount, 'rj_amount')
    // return parseFloat(Number(rj_amount)).toFixed(2)
    return rj_amount
  }

  /*============= Advance Clearance Calculation Part End ===================*/
   
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

    let bank_advance = tripInfo.advance_payment_info
      ? tripInfo.advance_payment_info.advance_payment
      : 0
    let advance_total_amount_data = Number(diesel_advance) + Number(bank_advance)
    console.log(diesel_advance, 'diesel_advance_freight')
    console.log(bank_advance, 'bank_advance_freight')
    console.log(advance_total_amount_data, 'advance_total_amount_data')
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

    console.log(total_freight)

    setFreight_total_amount(Number(total_freight))

    /* Freight = API Freight */
    // setFreight_balance_amount(Number(total_freight) - advance_total_amount_data)

    /* Freight = Actual Freight */
    setFreight_balance_amount(Number(total_actual_freight) - advance_total_amount_data)
  }, [tripInfo, shipmentInfo, stoTableData, stoTableDataRMSTO])

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
    sapData.append('KUNNR', 1003)
    sapData.append('REMARKS', values.income_sap_text) 

    console.log(sapData)
    NlmtTripSheetClosureSapService.tsDivisionIncomePost(sapData)
      .then((res) => {
        console.log(res, 'resresresres')

        let sap_resp = res.data && res.data[0] ? res.data[0] : ''

        if(sap_resp == ''){
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

        if(sap_status == '1' &&
          res.status == 200 &&
          sap_expense_post_document &&
          sap_expense_post_message &&
          sap_ts_no == tripsettlementData.tripsheet_no
        ){ 

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
                          Income
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

                        <CRow className="mt-2">
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="remarks">Expense Remarks</CFormLabel>
                            <CFormTextarea 
                              value={tripsettlementData.remarks ? tripsettlementData.remarks : '-'} 
                              readOnly
                            ></CFormTextarea>
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="remarks">SAP Expense Posting Amount</CFormLabel>
                            <CFormInput 
                              value={tripsettlementData.driver_expenses ? tripsettlementData.driver_expenses : '-'} 
                              readOnly
                            /> 
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="remarks">SAP Expense Posting Date</CFormLabel>
                            <CFormInput 
                              value={tripsettlementData.sap_expense_date ? tripsettlementData.sap_expense_date : '-'} 
                              readOnly
                            /> 
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="remarks">SAP Expense Doc. No</CFormLabel>
                            <CFormInput  
                              value={tripsettlementData.expense_sap_document_no ? tripsettlementData.expense_sap_document_no : '-'} 
                              readOnly
                            />
                          </CCol>
                        </CRow>
                        
                      </CTabPane>
                      {/* HIre Vehicles Income Capture Start */}
                      <CTabPane
                        role="tabpanel"
                        aria-labelledby="profile-tab"
                        visible={activeKey === 13}
                      >
                        
                        {/* ================== P&L Body Start ======================= */}
                        <CTable caption="top" style={{ height: '40vh', marginTop: '20px' }} hover>
                          <CTableCaption style={{ color: 'maroon' }}>Profit and Loss</CTableCaption>
                          <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                            <CTableRow>
                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                S.No
                              </CTableHeaderCell>

                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Type
                              </CTableHeaderCell>

                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Total
                              </CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>

                          <CTableBody>
                            <CTableRow>
                              <CTableHeaderCell scope="row">1</CTableHeaderCell>
                              <CTableDataCell>Income</CTableDataCell>

                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  id="inputAddress"
                                  value={values.income}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>

                            <CTableRow>
                              <CTableHeaderCell scope="row">2</CTableHeaderCell>
                              <CTableDataCell>Expense</CTableDataCell>

                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  id="inputAddress"
                                  value={tripsettlementData.expense}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="row">3</CTableHeaderCell>
                              <CTableDataCell>Profit and Loss</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput size="sm" id="inputAddress" value={PLFinder()} readOnly />
                              </CTableDataCell>
                            </CTableRow>
                          </CTableBody>
                        </CTable>
                        {/* ================== P&L Body End ======================= */}
                        <CRow className="mt-2">
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="income">Income Amount <REQ />{' '} </CFormLabel>
                            <CFormInput
                              name="income"
                              id="income"
                              onFocus={onFocus}
                              onBlur={onBlur}
                              maxLength={"6"}
                              onChange={(e) => {
                                const value = e.target.value;

                                // Allow only digits
                                if (/^\d*$/.test(value)) {
                                  handleChange(e);
                                }
                              }}
                              // onChange={handleChange}
                              rows="1"
                              value={values.income}
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="income_sap_text">SAP Text </CFormLabel>
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
                            <CFormLabel htmlFor="income_remarks">Pro Income Remarks</CFormLabel>
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
                            <CFormLabel htmlFor="income_posting_date">
                              Income Posting Date <REQ />{' '} 
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
                              <Link className="text-white" to="/NlmtTSIncomeClosureHome">
                                Cancel
                              </Link>
                            </CButton>
                            <CButton
                              size="sm"
                              color="success"
                              className="mx-3 text-white" 
                              onClick={() => {
                                // setFetch(false)
                                TripsheetIncomeClosureSubmit()
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
                {/* ============== Income Submit Confirm Button Modal Area ================= */}
                <CModal
                  visible={incomeSubmit}
                  backdrop="static"
                  // scrollable
                  onClose={() => {
                    setIncomeSubmit(false)
                  }}
                >
                  <CModalBody>
                    {tripsettlementData.driver_id == 0 ? (
                      <p className="lead">Are you sure to Post the Vendor expenses to SAP ?</p>
                    ) : (
                      <p className="lead">Are you sure to Post the Income Amount to SAP ?</p>
                    )}
                  </CModalBody>
                  <CModalFooter>
                    <CButton
                      className="m-2"
                      color="warning"
                      onClick={() => {
                        setIncomeSubmit(false)
                        setFetch(false)
                        sendDriverExpenseToSAP()
                      }}
                    >
                      Confirm
                    </CButton>
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setIncomeSubmit(false)
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

export default NlmtTripSheetInfoClosure
