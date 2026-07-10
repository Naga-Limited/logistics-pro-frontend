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
    CButtonGroup,
    CFormCheck,
    CAccordion,
    CAccordionItem,
    CAccordionHeader,
    CAccordionBody,
  } from '@coreui/react'
  import { React, useEffect, useState } from 'react'
  import { useNavigate, useParams } from 'react-router-dom'
  import { toast } from 'react-toastify'
  import Swal from 'sweetalert2'
  import Loader from 'src/components/Loader'
  // import Select from 'react-select';
  // import CModal from '@coreui/react/src/components/modal/CModal'
  import useForm from 'src/Hooks/useForm'

  import validate from 'src/Utils/Validation'

  import * as TripsheetClosureConstants from 'src/components/constants/TripsheetClosureConstants'
  import TripSheetClosureService from 'src/Service/TripSheetClosure/TripSheetClosureService'
  import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'
  import DieselVendorMasterService from 'src/Service/Master/DieselVendorMasterService'

  // import StoTableComponent from './StoTableComponent'
  import AllDriverListNameSelectComponent from 'src/components/commoncomponent/AllDriverListNameSelectComponent'
  // import StoTableRMSTOComponent from './StoTableRMSTOComponent'
  import CustomTable from 'src/components/customComponent/CustomTable'
  // /opt/lampp/htdocs/Logistics Pro/LP_FE/src/Pages/Nlmt/TripsheetClosure/Calculations/NlmtNlmtExpenseCalculations.js
  import NlmtExpenseCalculations from 'src/Pages/Nlmt/TripsheetClosure/Calculations/NlmtExpenseCalculations'
  import TripsheetClosureValidation from 'src/Utils/TripsheetClosure/TripsheetClosureValidation'
  import useFormRJSO from 'src/Hooks/useFormRJSO'
  import useFormTripsheetClosure from 'src/Hooks/useFormTripsheetClosure'
  import StoDeliverDataService from 'src/Service/SAP/StoDeliveryDataService'
  import StoDeliveryDataService from 'src/Service/SAP/StoDeliveryDataService'
  import RJSaleOrderCreationService from 'src/Service/RJSaleOrderCreation/RJSaleOrderCreationService'
  import VehicleMasterService from 'src/Service/Master/VehicleMasterService'
  // import RMSTOJourneyInfo from './JourneyInfo/RMSTOJourneyInfo'
  // import FGSALESJourneyInfo from './JourneyInfo/FGSALESJourneyInfo'
  // import RJSOJourneyInfo from './JourneyInfo/RJSOJourneyInfo'
  import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
  import { array, checkPropTypes, number } from 'prop-types'
  // import { prototype } from 'simplebar-react'
  import PropTypes from 'prop-types'
  import RMSTOJourneyInfo from './JourneyInfo/RMSTOJourneyInfo'
  import FGSALESJourneyInfo from './JourneyInfo/FGSALESJourneyInfo'
  import StoTableRMSTOComponent from '../TripsheetClosure/StoTableRMSTOComponent'
  import StoTableComponent from '../TripsheetClosure/StoTableComponent'
  import FoodsDivisionIncomeRequest from './IncomeRequest/FoodsDivisionIncomeRequest'
  import ConsumerDivisionIncomeRequest from './IncomeRequest/ConsumerDivisionIncomeRequest'
  import ReturnJourneyIncomeRequest from './IncomeRequest/ReturnJourneyIncomeRequest'
  import TripSheetClosureSapService from 'src/Service/SAP/TripSheetClosureSapService'
  import { isVariableDeclaration } from 'typescript'
import ExpenseIncomePostingDate from 'src/Pages/TripsheetClosure/Calculations/ExpenseIncomePostingDate'
  import CustomerCreationService from 'src/Service/CustomerCreation/CustomerCreationService'

  import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
  import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
  import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
  import RakeJourneyInfo from './JourneyInfo/RakeJourneyInfo'
  import ParkingYardGateService from 'src/Service/ParkingYardGate/ParkingYardGateService'
  import DepartmentApi from 'src/Service/SubMaster/DepartmentApi'
  import DivisionApi from 'src/Service/SubMaster/DivisionApi'
  import VehicleVarietyService from 'src/Service/SmallMaster/Vehicles/VehicleVarietyService'
  import VehicleRequestMasterService from 'src/Service/VehicleRequest/VehicleRequestMasterService'
  import VehicleBodyTypeService from 'src/Service/SmallMaster/Vehicles/VehicleBodyTypeService'
  import VehicleCapacityService from 'src/Service/SmallMaster/Vehicles/VehicleCapacityService'
  import SmallLoader from 'src/components/SmallLoader'
  import OthersJourneyInfo from './JourneyInfo/OthersJourneyInfo'
import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'
import FCIJourneyInfo from './JourneyInfo/FCIJourneyInfo'
import NlmtTripSheetClosureService from 'src/Service/Nlmt/TripSheetClosure/NlmtTripSheetClosureService'
import NlmtVehicleAssignmentService from 'src/Service/Nlmt/VehicleAssignment/NlmtVehicleAssignmentService'
import NlmtStoDeliveryDataService from 'src/Service/Nlmt/SAP/NlmtStoDeliveryDataService'
import NlmtRMSTOJourneyInfo from '../TripsheetClosure/JourneyInfo/NlmtRMSTOJourneyInfo'
import NlmtRakeJourneyInfo from '../TripsheetClosure/JourneyInfo/NlmtRakeJourneyInfo'
import NlmtFCIJourneyInfo from '../TripsheetClosure/JourneyInfo/NlmtFCIJourneyInfo'
import NlmtFGSALESJourneyInfo from '../TripsheetClosure/JourneyInfo/NlmtFGSALESJourneyInfo'
import NlmtOthersJourneyInfo from '../TripsheetClosure/JourneyInfo/NlmtOthersJourneyInfo'
import NlmtDefinitionsListApi from 'src/Service/Nlmt/Masters/NlmtDefinitionsListApi'
import NlmtTripSheetClosureSapService from 'src/Service/Nlmt/SAP/NlmtTripSheetClosureSapService'
  const NlmtTripSheetSettlementClosure = () => {
    /*================== User Id & Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    const user_locations = []
    const navigation = useNavigate()

    const Expense_Income_Posting_Date = ExpenseIncomePostingDate();
    // console.log(Expense_Income_Posting_Date,'ExpenseIncomePostingDate')

    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
      user_locations.push(data.id)
    })


    /* Get User Id From Local Storage */
    const user_id = user_info.user_id

    // console.log(user_locations)
    /*================== User Location Fetch ======================*/

    /* ==================== Access Part Start ========================*/
    // const [screenAccess, setScreenAccess] = useState(false)
    // const [restrictScreenById, setRestrictScreenById] = useState(true)
    // let page_no = LogisticsProScreenNumberConstants.TripSettlementScreens.Tripsheet_Settlement_Closure

    // useEffect(()=>{

    //   if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
    //     console.log('screen-access-allowed')
    //     setScreenAccess(true)
    //   } else{
    //     console.log('screen-access-not-allowed')
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
      settlement_remarks: '',
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
      income_posting_date: '',
    }

    const tripPurposeFinder = (code) => {
      let p_code = '-'
      if(code == '1'){
        p_code = 'FG-SALES'
      } else if(code == '2'){
        p_code = 'FG-STO'
      } else if(code == '3'){
        p_code = 'RM-STO'
      } else if(code == '4'){
        p_code = 'OTHERS'
      } else if(code == '5'){
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
    } = useFormTripsheetClosure(login, TripsheetClosureValidation, formValues)

    function login() {
      // alert('No Errors CallBack Called')
    }

    const { id } = useParams()
    const [fetch, setFetch] = useState(false)
    const [smallFetch, setSmallFetch] = useState(false)
    const [stoDeliveryEdit, setStoDeliveryEdit] = useState(false)

    /* Rejection Type : 0 - Submit, 1 - Expection Reject, 2 - Income Reject */
    const [rejectionType, setRejectionType] = useState(0)

    const [freight_balance_amount, setFreight_balance_amount] = useState(0)
    const [freight_total_amount, setFreight_total_amount] = useState(0)
    const [advance_total_amount, setAdvance_total_amount] = useState(0)
    const [shipmentInfo, setShipmentInfo] = useState([])
    const [tripsettlementData, setTripsettlementData] = useState([])
    const [vehicleRequestsData, setVehicleRequestsData] = useState([])

    /* Income Divisions State Declaration */
    const [foodsDivisionData, setFoodsDivisionData] = useState([])
    const [mmdDivisionData, setMmdDivisionData] = useState([])
    const [consumerDivisionData, setConsumerDivisionData] = useState([])
    const [mineralDivisionData, setMineralDivisionData] = useState([])
    const [detergentDivisionData, setDetergentDivisionData] = useState([])
    const [ifoodDivisionData, setIfoodDivisionData] = useState([])
    const [serviceDivisionData, setServiceDivisionData] = useState([])

    /* Overall Journey Information Constants */
    const [tripFgsalesData, setTripFgsalesData] = useState([])
    const [tripRjsoData, setTripRjsoData] = useState([])
    const [tripStoData, setTripStoData] = useState([])

    /* 0-Default, 1-Foods Only, 2-Consumer Only, 3-Foods With RJ, 4-Consumer With RJ, 5-Foods With Consumer, 6-Foods With Consumer With RJ */
    const [tripJournyAvailable, setTripJournyAvailable] = useState(0)

    const [rjsoInfo, setRjsoInfo] = useState([])
    const [stoTableData, setStoTableData] = useState([])
    const [tripOthersStoData, setTripOthersStoData] = useState([])
    const [stoTableDataRMSTO, setStoTableDataRMSTO] = useState([])
    const [errorModal, setErrorModal] = useState(false)
    const [error, setError] = useState({})

    const [totalTripIncome, setTotalTripIncome] = useState(0)
    const [totalTripPL, setTotalTripPL] = useState(0)

    const uomName = (id) => {
      if (id == 1) {
        return 'TON'
      } else if (id == 2) {
        return 'KG'
      } else {
        return ''
      }
    }

    const vendorCodeFinder = (data) => {
      let v_code = ''
      if(data.Parking_Vendor_Info){
        v_code = data.Parking_Vendor_Info.vendor_code
      } else {
        v_code = data.vendor_info.vendor_code
      }
      return v_code
    }

    useEffect(() => {
      const val_obj = Object.entries(values)

      val_obj.forEach(([key_st, value]) => {})
      // console.log(values, 'values')
      // console.log(formValues, 'formValues')
    }, [values, formValues])

    const expenseDataCapture = (event) => {
      let expense_name = event.target.name

      let expense_value = event.target.value
      // TripsheetClosureValidation(formValues)
      // console.log(expense_name)
      // console.log(expense_value)

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

    /* ===================== The Constants Needed For First Render Part End ===================== */

    /* ===================== The Very First Render Part Start ===================== */

    useEffect(() => {
      if (id) {
        NlmtTripSheetClosureService.getTripSettlementInfoByParkingId(id).then((res) => {
          console.log(res.data.data[0], 'TripSheetClosureService.getTripSettlementInfoByParkingId')
          setTripsettlementData(res.data.data[0])
          values.remarks = res.data.data[0].remarks
          values.income_remarks = res.data.data[0].income_remarks
        })

        NlmtVehicleAssignmentService.getShipmentInfoByPId(id).then((res) => {
          console.log(res.data.data, 'VehicleAssignmentService.getShipmentInfoByPId')
          let shipment_data = res.data.data
          setTripFgsalesData(shipment_data)
        })

        RJSaleOrderCreationService.getRJSaleOrderbyParkingId(id).then((res) => {
          console.log(res.data.data, 'RJSaleOrderCreationService.getRJSaleOrderbyParkingId')
          if (res.data.data) {
            setTripRjsoData(res.data.data)
          }
        })

        /* section for getting Shipment Routes For Shipment Creation from database */
        DefinitionsListApi.visibleDefinitionsListByDefinition(11).then((response) => {
          console.log(response.data.data, 'PMData')
          setPMData(response.data.data)
        })

        NlmtTripSheetClosureService.getTripStoInfoByParkingId(id).then((res) => {
          console.log(res.data.data, 'TripSheetClosureService.getTripStoInfoByParkingId')

          let stoList = res.data.data

          let others_sto_filterData =  stoList.filter(
            (data) => data.sto_delivery_type == 3
          )

          let sto_filterData =  stoList.filter(
            (data) => data.sto_delivery_type != 3
          )

          setTripStoData(sto_filterData)
          setTripOthersStoData(others_sto_filterData)

        })
      }
    }, [id])

    useEffect(() => {
      if (id) {
        NlmtTripSheetClosureService.getVehicleInfoById(id)
          .then((res) => {
            let fetchedData = res.data.data
            console.log(fetchedData, 'TripSheetClosureService.getVehicleInfoById')

            if(user_info.is_admin == 0 && (fetchedData.vehicle_current_position == 26 || fetchedData.vehicle_current_position == 28)){
              setRestrictScreenById(false)
            }
            // fetchedData.vehicle_assignment
            //   ? setShipmentNumber(fetchedData.vehicle_assignment.shipment_no)
            //   : setShipmentNumber('')
            setTripInfo(res.data.data)
            if (fetchedData.rj_so_info) {
              setRjsoInfo(fetchedData.rj_so_info)
            } else {
              setRjsoInfo([])
            }
            if (fetchedData.diesel_intent_collection_info) {
              setDieselCollectionInfo(fetchedData.diesel_intent_collection_info)
              // totalDieselInfoCalculation(fetchedData.diesel_intent_collection_info)
            } else {
              setDieselCollectionInfo([])
            }

            if (fetchedData.vehicle_assignment) {

              let updated_shipment_info = fetchedData.vehicle_assignment
              console.log(updated_shipment_info, 'updated_shipment_info')
              let fetchedData_shipment_info = updated_shipment_info.filter((data) =>data.shipment_status == 5)
              console.log(fetchedData_shipment_info, 'fetchedData_shipment_info')
              setShipmentInfo(fetchedData_shipment_info)
            } else {
              setShipmentInfo([])
            }
            fetchedData.vehicle_info.vehicle_type_id == 3 ? setMainKey(1) : setMainKey(2)
            // fetchedData.rj_so_info == null ? setrjso_enable(false) : setrjso_enable(true)

            fetchedData.rj_so_info?.length > 0 ? setrjso_enable(true) : setrjso_enable(false)
            fetchedData.vehicle_assignment.length > 0
              ? setfg_sales_enable(true)
              : setfg_sales_enable(false)
            // fetchedData.vehicle_assignment.purpose == 1
            //   ? setfg_sales_enable(true)
            //   : setfg_sales_enable(false)
            fetchedData.tripsheet_info.purpose != 1 ? setsto_enable(true) : setsto_enable(false)
            setFetch(true)
          })
          .catch((error) => {
            setFetch(true)
            toast.warning(error)
          })
      }
    }, [id])
console.log(tripInfo,'tripInfo')
console.log(shipmentInfo,'shipmentInfo')

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

      // console.log(tabFGSALESHireSuccess, 'tabFGSALESHireSuccess')
      // console.log(tabFGSALESHireAvailable, 'tabFGSALESHireAvailable')
      // console.log(stoTableData.length, 'stoTableData')
      // console.log(stoTableDataRMSTO.length, 'stoTableDataRMSTO')
      // console.log(tabFreightHireSuccess, 'tabFreightHireSuccess')
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

    const changeVadTableItem = (event, child_property_name, parent_index, child_index) => {
      let getData = event.target.value
      // console.log(getData, 'getData')

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

    const divisionFinder = (data_need) => {
      console.log(data_need,'divisionFinder-data_need')
      let ship_child_data = data_need.shipment_child_info
      let customer_code_1060_check = '100001'
      let cc_array = ['1060','1003','1081']
      ship_child_data.map((val,ind)=>{
        if(!JavascriptInArrayComponent(val.customer_info.CustomerCode,cc_array)){
          customer_code_1060_check = '100002'
        }
      })

      if(customer_code_1060_check == '100001' && data_need.assigned_by == '1'){
        return 'NLCD'
      }

      if(data_need.assigned_by == '2'){
        return 'NLCD'
      } else {
        return 'NLFD'
      }
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

    const freight_generate = (data, type) => {
      let trip_income_amount = 0
      if (type == 'sto1' || type == 'sto2') {
        trip_income_amount = total_trip_settlement_freight(data, 'sto')
      } else if (type == 'fgs1' || type == 'fgs2') {
        trip_income_amount = total_trip_settlement_freight(data, 'fgsales')
      } else if (type == 'rjso') {
        trip_income_amount = total_trip_settlement_freight(data, 'rjso')
      }

      return trip_income_amount
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

      var income_base_charges1 = data.income_base_charges_input
        ? Number(data.income_base_charges_input)
        : data.income_base_charges
        ? Number(data.income_base_charges)
        : 0

      var income_halting_charges1 = data.income_halting_charges_input
        ? Number(data.income_halting_charges_input)
        : data.income_halting_charges
        ? Number(data.income_halting_charges)
        : 0
      var income_sub_delivery_charges1 = data.income_sub_delivery_charges_input
        ? Number(data.income_sub_delivery_charges_input)
        : data.income_sub_delivery_charges
        ? Number(data.income_sub_delivery_charges)
        : 0
      var income_unloading_charges1 = data.income_unloading_charges_input
        ? Number(data.income_unloading_charges_input)
        : data.income_unloading_charges
        ? Number(data.income_unloading_charges)
        : 0
      var income_weighment_chares1 = data.income_weighment_chares_input
        ? Number(data.income_weighment_chares_input)
        : data.income_weighment_chares
        ? Number(data.income_weighment_chares)
        : 0
      var income_low_tonage_charges1 = data.income_low_tonage_charges_input
        ? Number(data.income_low_tonage_charges_input)
        : data.income_low_tonage_charges
        ? Number(data.income_low_tonage_charges)
        : 0
        var income_toll_charges1 = data.income_toll_charges_input
        ? Number(data.income_toll_charges_input)
        : data.income_toll_charges
        ? Number(data.income_toll_charges)
        : 0
      var income_others_charges1 = data.income_others_charges_input
        ? Number(data.income_others_charges_input)
        : data.income_others_charges
        ? Number(data.income_others_charges)
        : 0

      var freight_amount1 = 0

      if (type == 'fgsales') {
        freight_amount1 = data.shipment_freight_amount ? Number(data.shipment_freight_amount) : 0
      } else if (type == 'rjso') {
        freight_amount1 = data.freight_income ? Number(data.freight_income) : 0
      } else if (type == 'sto') {
        freight_amount1 = data.freight_amount ? Number(data.freight_amount) : 0
      } else if (type == 'others_sto') {
        freight_amount1 = data.freight_amount ? Number(data.freight_amount) : 0
      }

      var freight_charge = 0
      console.log(income_base_charges1, 'income_base_charges1')
      if (income_base_charges1 && income_base_charges1 > 0) {
        freight_charge = income_base_charges1
      } else {
        freight_charge = freight_amount1
      }

      let total_data1 =
        freight_charge +
        income_halting_charges1 +
        income_sub_delivery_charges1 +
        income_unloading_charges1 +
        income_weighment_chares1 +
        income_low_tonage_charges1 +
        income_toll_charges1 +
        income_others_charges1

      console.log(total_data1, 'total_data1')
      return total_data1
    }

    const changeVadTableItemForIncome = (event, child_property_name, parent_index) => {
      let getData = event.target.value
      console.log(getData, 'getData')

      getData = event.target.value.replace(/\D/g, '')

      const shipment_parent_income_info = JSON.parse(JSON.stringify(shipmentInfo))
      // const shipment_parent_income_info = JSON.parse(JSON.stringify(tripFgsalesData))

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
      if (shipment_parent_income_info[parent_index].vehicle_type_id == '3') {
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
      return input === undefined ? original : input
      // let data = input ? input : original
      // console.log(input)
      // console.log(original)
      // console.log(data)
      // return data
    }

    /* ===================== Vehicle Assignment Details Table Income Capture Part End ===================== */

    /* ============== Function for Get Total Freight Start =============== */
    const total_freight_calculation = (type, data) => {
      let total_freight = 0
      let base_freight = 0
      let additional_freight = 0

      console.log(data)

      let additional_freight1 = data.income_halting_charges_input
        ? Number(data.income_halting_charges_input)
        : data.income_halting_charges
        ? Number(data.income_halting_charges)
        : 0
      let additional_freight2 = data.income_sub_delivery_charges_input
        ? Number(data.income_sub_delivery_charges_input)
        : data.income_sub_delivery_charges
        ? Number(data.income_sub_delivery_charges)
        : 0
      let additional_freight3 = data.income_unloading_charges_input
        ? Number(data.income_unloading_charges_input)
        : data.income_unloading_charges
        ? Number(data.income_unloading_charges)
        : 0
      let additional_freight4 = data.income_weighment_chares_input
        ? Number(data.income_weighment_chares_input)
        : data.income_weighment_chares
        ? Number(data.income_weighment_chares)
        : 0
      let additional_freight5 = data.income_low_tonage_charges_input
        ? Number(data.income_low_tonage_charges_input)
        : data.income_low_tonage_charges
        ? Number(data.income_low_tonage_charges)
        : 0
      let additional_freight6 = data.income_others_charges_input
        ? Number(data.income_others_charges_input)
        : data.income_others_charges
        ? Number(data.income_others_charges)
        : 0
      let additional_freight7 = data.income_base_charges_input
        ? Number(data.income_base_charges_input)
        : data.income_base_charges
        ? Number(data.income_base_charges)
        : 0
      let additional_freight8 = data.income_toll_charges_input
        ? Number(data.income_toll_charges_input)
        : data.income_toll_charges
        ? Number(data.income_toll_charges)
        : 0

      additional_freight =
        additional_freight1 +
        additional_freight2 +
        additional_freight3 +
        additional_freight4 +
        additional_freight5 +
        additional_freight6 +
        additional_freight8

      if (type == 'sto') {
        base_freight = Number(data.freight_amount)
      } else if (type == 'fg-sales') {
        base_freight = Number(data.shipment_freight_amount)
      } else if (type == 'rjso') {
        base_freight = Number(data.freight_income)
      } else if (type == 'others') {
        base_freight = data.freight_amount ? Number(data.freight_amount) : 0
      }

      console.log(additional_freight7, 'additional_freight7')
      if (additional_freight7 && additional_freight7 > 0) {
        total_freight = additional_freight + additional_freight7
      } else {
        total_freight = base_freight + additional_freight
      }

      // total_freight = base_freight + additional_freight
      console.log(base_freight, 'base_freight')
      console.log(additional_freight, 'additional_freight')
      console.log(total_freight, 'total_freight')

      return total_freight
    }
    /* ============== Function for Get Total Freight End =============== */

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
      return input === undefined ? original : input
      // let data = input ? input : original
      // return data
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
        ant_sto =
          sto_parent_income_info[parent_index].trip_driver_id == ''
            ? document.getElementById(`trip_hire_fgsto_freight_${parent_index}`)
            : document.getElementById(`trip_own_fgsto_freight_${parent_index}`)
      } else if (sto_parent_income_info[parent_index].sto_delivery_type == '4') {
        ant_sto = document.getElementById(`trip_own_fci_freight_${parent_index}`)
      } else if (sto_parent_income_info[parent_index].sto_delivery_type == '2') {
        ant_sto =
          sto_parent_income_info[parent_index].trip_driver_id == ''
            ? document.getElementById(`trip_hire_rmsto_freight_${parent_index}`)
            : document.getElementById(`trip_own_rmsto_freight_${parent_index}`)
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
      let data = input ? input : original
      return data
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
      data.map((ll,jj)=>{
        let sto_do_type = ll.sto_delivery_type
        let sto_rm_type = ll.rm_type
        if(type == 1 && (sto_do_type == 1 || (sto_do_type == 2 && sto_rm_type == 1))){
          condition_code1 = 1
        } else if(type == 2 && sto_do_type == 2 && sto_rm_type == 2){
          condition_code2 = 1
        } else if(type == 3 && sto_do_type == 4){
          condition_code3 = 1
        }
      })

      console.log(type,'JourneyInfoExists-type')
      console.log(condition_code1,'JourneyInfoExists-condition_code1')
      console.log(condition_code2,'JourneyInfoExists-condition_code2')
      console.log(condition_code3,'JourneyInfoExists-condition_code3')
      if((type == 1 && condition_code1 == 1) || (type == 2 && condition_code2 == 1) || (type == 3 && condition_code3 == 1)){
        return true
      }

      return false
    }

    /* ===================== TripsheetSettlementClosureSubmit Start ===================== */

    const TripsheetIncomeClosureSubmit = () => {

      if (values.income_posting_date == '') {
        setFetch(true)
        toast.warning('You should select Income posting date before submitting..!')
        return false
      }

      // ============= Posting date Validation Part =================== //

      let Expense_Income_Posting_Date_Taken = ExpenseIncomePostingDate();
      let from_date = Expense_Income_Posting_Date_Taken.min_date
      let to_date = Expense_Income_Posting_Date_Taken.max_date

      if(JavascriptDateCheckComponent(from_date,values.income_posting_date,to_date)){
        //
      } else {
        setFetch(true)
        toast.warning('Invalid Income Posting date')
        return false
      }
      // ============= Posting date Validation Part =================== //

      if (tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id != '3') {
        if (tripInfo.diesel_intent_info && tripInfo.diesel_intent_info.diesel_vendor_sap_invoice_no) {
          // Diesel Intent Part Completed
        } else {
          toast.warning(
            'Before Submittting Settlement, Please Finish the Diesel Indent Process Completion..!'
          )
          return false
        }
      }
      // if (rjsoInfoCheck() || rjsoInfo.length == 0) {
      //   addSettlementClosureRequest()
      // } else {
      //   return false
      // }

      setSettlementSubmit(true)
    }

    const TripsheetSettlementClosureCancel = (type) => {
      console.log(values.settlement_remarks)
      setRejectionType(type)
      if (values.settlement_remarks && values.settlement_remarks.trim()) {
        // alert(values.income_remarks)

        setSettlementReject(true)
      } else {
        toast.warning('You should give the proper reason for rejection via Settlement remarks... ')
        values.settlement_remarks = ''
        return false
      }
    }

    const rjsoInfoCheck = () => {
      let rjso_info_error = ''
      if (rjsoInfo.length > 0) {
        rjsoInfo.map((data, index) => {
          if (
            data.balance_payment_received_input == '1' &&
            !data.balance_payment_received_time_input
          ) {
            toast.warning('You should enter the time when RJ balance payment received.. ')
            rjso_info_error += 'error1 '
            return false
          } else if (data.balance_payment_received_input == '1' && !data.balance_payment_mode_input) {
            toast.warning('You should enter the payment mode when RJ balance payment received.. ')
            rjso_info_error += 'error2 '
            return false
          }
        })
      }

      if (rjso_info_error) {
        return false
      } else {
        return true
      }
    }

    /* ===================== TripsheetSettlementClosureSubmit End ===================== */

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
      if (tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id == 3) {
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
          Number(totalMaintenanceCost ? totalSubDeliveryCharges : 0) +
          Number(totalLoadingCharges ? totalSubDeliveryCharges : 0) +
          Number(totalUnloadingCharges ? totalSubDeliveryCharges : 0) +
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
      if (tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id == '3') {
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

      setTotalTollAmount(NlmtExpenseCalculations(lp_trip_data, 'toll_amount'))
      setTotalBata(NlmtExpenseCalculations(lp_trip_data, 'bata'))
      setTotalMunicipalCharges(NlmtExpenseCalculations(lp_trip_data, 'municipal_charges'))
      setTotalPortEntryFee(NlmtExpenseCalculations(lp_trip_data, 'port_entry_fee'))
      setTotalMiscCharges(NlmtExpenseCalculations(lp_trip_data, 'misc_charges'))
      setTotalFineAmount(NlmtExpenseCalculations(lp_trip_data, 'fine_amount'))
      setTotalSubDeliveryCharges(NlmtExpenseCalculations(lp_trip_data, 'sub_delivery_charges'))
      setTotalMaintenanceCost(NlmtExpenseCalculations(lp_trip_data, 'maintenance_cost'))
      setTotalLoadingCharges(NlmtExpenseCalculations(lp_trip_data, 'loading_charges'))
      setTotalUnloadingCharges(NlmtExpenseCalculations(lp_trip_data, 'unloading_charges'))
      setTotalTarpaulinCHarges(NlmtExpenseCalculations(lp_trip_data, 'tarpaulin_charges'))
      setTotalWeighmentCharges(NlmtExpenseCalculations(lp_trip_data, 'weighment_charges'))
      setTotalLowTonageCharges(NlmtExpenseCalculations(lp_trip_data, 'low_tonage_charges'))
      setTotalStockDiversionReturnCharges(
        NlmtExpenseCalculations(lp_trip_data, 'diversion_return_charges')
      )
      setTotalHaltDays(NlmtExpenseCalculations(lp_trip_data, 'halt_days'))
      setTotalHaltingCharges(NlmtExpenseCalculations(lp_trip_data, 'halting_charges'))
      setTotalFreightCharges(NlmtExpenseCalculations(lp_trip_data, 'freight_charges'))
    }, [
      shipmentInfo,
      rjsoInfo,
      stoTableData,
      stoTableDataRMSTO,
      totalTollAmount,
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
      totalStockDiversionReturnCharges,
    ])

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

    const [settlementReject, setSettlementReject] = useState(false)
    const [settlementSubmit, setSettlementSubmit] = useState(false)
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

        const item = list.find(
          (x) => String(x.definition_list_id) === String(id)
        )

        return item ? item.definition_list_name.trim() : ''
      }

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
      var hire_vehicle_check = tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id == 3 ? true : false
      console.log(hire_vehicle_check, 'hire_vehicle_check')
      if (
        data.sto_delivery_number != '' &&
        data.sto_po_number != '' &&
        data.sto_delivery_division != '' &&
        data.sto_from_location != '' &&
        data.sto_to_location != '' &&
        data.sto_delivery_quantity != '' &&
        data.sto_freight_amount != '' &&
        data.sto_delivery_date_time != '' &&
        data.sto_pod_copy != '' &&
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

    const handleStoExpenseCaptureChange = (event) => {
      let updatedinputs = { ...stoValues, [event.target.name]: event.target.checked }
      setStoValues(updatedinputs)
      console.log(stoValues)
      console.log(stoTableData)
    }

    const total_journey_income = (val,type=0) => {
      console.log(val,'total_journey_income_value')
      let total_freight = 0
      let freight1 = val.income_halting_charges_input
        ? Number(parseFloat(val.income_halting_charges_input).toFixed(2))
        : val.income_halting_charges
        ? Number(parseFloat(val.income_halting_charges).toFixed(2))
        : 0
      let freight2 = val.income_low_tonage_charges_input
        ? Number(parseFloat(val.income_low_tonage_charges_input).toFixed(2))
        : val.income_low_tonage_charges
        ? Number(parseFloat(val.income_low_tonage_charges).toFixed(2))
        : 0
      // let freight2 = Number(parseFloat(val.income_low_tonage_charges).toFixed(2))
      let freight3 = val.income_others_charges_input
        ? Number(parseFloat(val.income_others_charges_input).toFixed(2))
        : val.income_others_charges
        ? Number(parseFloat(val.income_others_charges).toFixed(2))
        : 0
      // let freight3 = Number(parseFloat(val.income_others_charges).toFixed(2))
      let freight4 = val.income_sub_delivery_charges_input
        ? Number(parseFloat(val.income_sub_delivery_charges_input).toFixed(2))
        : val.income_sub_delivery_charges
        ? Number(parseFloat(val.income_sub_delivery_charges).toFixed(2))
        : 0
      // let freight4 = Number(parseFloat(val.income_sub_delivery_charges).toFixed(2))
      let freight5 = val.income_unloading_charges_input
        ? Number(parseFloat(val.income_unloading_charges_input).toFixed(2))
        : val.income_unloading_charges
        ? Number(parseFloat(val.income_unloading_charges).toFixed(2))
        : 0
      // let freight5 = Number(parseFloat(val.income_unloading_charges).toFixed(2))
      let freight6 = val.income_weighment_chares_input
        ? Number(parseFloat(val.income_weighment_chares_input).toFixed(2))
        : val.income_weighment_chares
        ? Number(parseFloat(val.income_weighment_chares).toFixed(2))
        : 0
      // let freight6 = Number(parseFloat(val.income_weighment_chares).toFixed(2))
      let freight7 =
        Number(val.income_base_charges_input) > 0
          ? Number(parseFloat(val.income_base_charges_input).toFixed(2))
          : val.shipment_freight_amount
          ? Number(parseFloat(val.shipment_freight_amount).toFixed(2))
          : Number(parseFloat(val.freight_amount).toFixed(2))
      let freight8 = val.income_toll_charges_input
          ? Number(parseFloat(val.income_toll_charges_input).toFixed(2))
          : val.income_toll_charges
          ? Number(parseFloat(val.income_toll_charges).toFixed(2))
          : 0

      console.log(freight1, 'freight1')
      console.log(freight2, 'freight2')
      console.log(freight3, 'freight3')
      console.log(freight4, 'freight4')
      console.log(freight5, 'freight5')
      console.log(freight6, 'freight6')
      console.log(freight7, 'freight7')
      console.log(freight8, 'freight8')

      if(type == 1){
        total_freight = freight7 /* Base Freight */
      } else if(type == 2){
        total_freight = freight1 + freight2 + freight3 + freight4 + freight5 + freight6 + freight8 /* Additional Freight */
      } else {
        total_freight = freight1 + freight2 + freight3 + freight4 + freight5 + freight6 + freight7 + freight8 /* Total Freight */
      }

      console.log(total_freight, 'total_journey_income')
      return total_freight
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
      let hire_vehicle_check_rmsto = tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id == 3 ? true : false
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

    /* GET STO DETAILS FROM SAP */
    const getStoDeliveryData = (e) => {
      // setFetch(false)
      e.preventDefault()
      // let panDetail =
      console.log(stoValues.sto_delivery_number)

      NlmtStoDeliveryDataService.getStoDeliveryData(stoValues.sto_delivery_number).then((res) => {
        let sap_response = res.data[0]
        let sap_vehicle_no = sap_response.SIGNI
        let sap_po_number = sap_response.EBELN
        let sap_delivery_number = sap_response.VBELN
        let sap_from_location = sap_response.RESWK
        let sap_to_location = sap_response.WERKS
        let sap_delivery_quantity = sap_response.LFIMG
        let sap_delivery_freight = sap_response.KBETR
        let sap_delivery_division = sap_response.DIVISION
        console.log(res)

        let vehicleTripNumber = 'TN69RT4545'
        // let vehicleTripNumber = tripInfo.vehicle_number {/* This will line should uncomment on production instead of previous */}
        console.log(sap_vehicle_no)
        if (!sap_vehicle_no) {
          emptySToData()
          toast.warning('No STO Delivery Details Detected! ')
          return false
        }

        if (sap_vehicle_no !== vehicleTripNumber) {
          emptySToData()
          toast.warning('Vehicle Number Mismatched')
          return false
        }

        if (
          sap_vehicle_no &&
          sap_po_number &&
          sap_from_location &&
          sap_to_location &&
          sap_delivery_quantity &&
          sap_delivery_freight &&
          sap_delivery_division
        ) {
          assignSTOData(sap_response)
        } else {
          emptySToData()
          toast.warning('No STO Delivery Details Detected! ')
          return false
        }

        console.log(sap_vehicle_no + '/' + sap_po_number + '/' + sap_delivery_number)

        console.log(res)
      })
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
      if (stoTableData && tripInfo && tripInfo.tripsheet_info && shipmentInfo && stoTableDataRMSTO && rjsoInfo) {
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
      if(data.sto_delivery_type == '1'){
        j_type = 'FG-STO'
      } else if(data.sto_delivery_type == '4'){
        j_type = 'FCI'
      } else {
        if(data.rm_type == '2'){
          j_type = 'RAKE'
        } else {
          j_type = 'RM-STO'
        }
      }
      return j_type
    }

    const stoDivisionFinder = (data) => {
      let div = ''
      if(data.sto_delivery_division == 'CONSUMER'){
        div = 'NLCD'
      } else if(data.sto_delivery_division == 'MMD'){
        div = 'MMD'
      } else {
        div = 'NLFD'
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
      driver_expense =
        Number(tripsettlementData.expense) -
        (Number(tripsettlementData.fasttag_toll_amount) + Number(tripsettlementData.registered_diesel_amount))
      // return parseFloat(Number(driver_expense)).toFixed(2)
      return driver_expense
    }

    const rj_receipt_amount_calculation = () => {
      console.log(rjsoInfo)
      let rj_amount = 0
      rjsoInfo.map((da, ins) => {
        if (da.balance_payment_received_input == '1' || da.balance_payment_received == '1') {
          rj_amount += Number(da.freight_income)
        } else {
          rj_amount += Number(da.advance_amount)
        }
      })
      console.log(rj_amount, 'rj_amount')
      // return parseFloat(Number(rj_amount)).toFixed(2)
      return rj_amount
    }

    const total_amount_calculation = () => {
      let total_amount = 0
      let advance_amount = 0

      if (tripInfo.advance_payment_info) {
        advance_amount = Number(tripInfo.advance_payment_info.advance_payment) + Number(tripInfo.advance_payment_info.additional_advance_payment)
      }

      total_amount = Number(rj_receipt_amount_calculation()) + advance_amount

      console.log(total_amount, 'total_amount')
      console.log(advance_amount, 'advance_amount')
      // return parseFloat(Number(total_amount)).toFixed(2)
      return total_amount
    }

    const balance_amount_calculation = () => {
      let balance_amount = 0

      if (tripInfo.advance_payment_info) {
        if (rjsoInfo.length > 0) {
          balance_amount = total_amount_calculation() - driver_expense_calculation()
        } else {
          balance_amount =
          Number(tripInfo.advance_payment_info.advance_payment) + Number(tripInfo.advance_payment_info.additional_advance_payment) - driver_expense_calculation()
        }
      } else {
        if (rjsoInfo.length > 0) {
          balance_amount = total_amount_calculation() - driver_expense_calculation()
        } else {
          balance_amount = 0 - driver_expense_calculation()
        }
      }

      // return parseFloat(Number(balance_amount)).toFixed(2)
      return balance_amount
    }

    /*============= Advance Clearance Calculation Part End ===================*/

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

    console.log(stoTableDataRMSTO)

    const rmstoDataUpdateForDCC = (original, input) => {
      return input === undefined ? original : input
    }

    /* ====== Diesel Consumption Ltr (Aprox.) & Runnnig KM Calculation Part End ===== */

    const fetchShipmentChildData = (shipmentNumber) => {
      NlmtVehicleAssignmentService.getSingleShipmentChildInfo(shipmentNumber).then((res) => {
        console.log(res.data.data)
        setShipmentChildInfo(res.data.data)
      })
    }

    const getDieselVendorNameById = (vendor_id) => {

      console.log(dvData,'dieselVendorFinder-dvData')
      console.log(vendor_id,'dieselVendorFinder-vendor_id')
      let vendorName = '-'
      for (let i = 0; i < dvData.length; i++) {
        if (dvData[i].diesel_vendor_id == vendor_id) {
          vendorName = dvData[i].diesel_vendor_name
        }
      }
      console.log(vendorName,'dieselVendorFinder-vendorName')
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

    useEffect(() => {
      let trip_income = 0

      console.log(shipmentInfo.length, 'shipmentInfo.length')
      console.log(rjsoInfo.length, 'rjsoInfo.length')
      console.log(tripStoData.length, 'tripStoData.length')

      if (shipmentInfo.length > 0) {
        console.log(shipmentInfo)
        shipmentInfo.map((dat1, ind1) => {
          trip_income += total_freight_calculation('fg-sales', dat1)
        })
      }

      if (rjsoInfo.length > 0) {
        console.log(rjsoInfo)
        rjsoInfo.map((dat2, ind2) => {
          trip_income += total_freight_calculation('rjso', dat2)
        })
      }

      if (tripStoData.length > 0) {
        console.log(tripStoData)
        tripStoData.map((dat3, ind1) => {
          trip_income += total_freight_calculation('sto', dat3)
        })
      }

      if (tripOthersStoData.length > 0) {
        console.log(tripOthersStoData)
        tripOthersStoData.map((dat4, ind1) => {
          trip_income += total_freight_calculation('others', dat4)
        })
      }

      console.log(trip_income, 'trip_income')

      if (tripsettlementData.registered_diesel_amount == 0 && tdaDieselInfo && tdaDieselInfo != '0') {
        let expens = Number(tripsettlementData.expense) + Number(tdaDieselInfo)
        console.log(expens, 'expens')
        setTotalTripPL(parseFloat(trip_income - expens).toFixed(2))
      } else {
        setTotalTripPL(parseFloat(trip_income - tripsettlementData.expense).toFixed(2))
      }

      // let modified_trip_income = parseFloat(trip_income).toFixed)

      setTotalTripIncome(parseFloat(trip_income).toFixed(2))
    }, [shipmentInfo, rjsoInfo, tripStoData, tripOthersStoData])

    const incomeEdit = (division) => {
        let income_edit_readonly = false
        if(division == 2) {
            income_edit_readonly = tripsettlementData.income_nlcd_sap_document_no ? true : false
        } else if(division == 1) {
            income_edit_readonly = tripsettlementData.income_nlfd_sap_document_no ? true : false
        }
        return income_edit_readonly
    }

    const incomeSTOEdit = (division) => {
        let income_sto_edit_readonly = false
        if(division == 'CONSUMER') {
            income_sto_edit_readonly = tripsettlementData.income_nlcd_sap_document_no ? true : false
        } else if(division == 'FOODS') {
            income_sto_edit_readonly = tripsettlementData.income_nlfd_sap_document_no ? true : false
        }
        return income_sto_edit_readonly
    }

    /* Settlement Closure Submit Request */
    const addSettlementClosureRequest = () => {
      if (rejectionType != 0) {
        const formData = new FormData()

        formData.append('settlement_remarks', values.settlement_remarks)
        formData.append('rejected_by', 2)

        let tripsheet_is_settled_value = rejectionType == 1 ? 5 : 4
        formData.append('tripsheet_is_settled', tripsheet_is_settled_value)
        formData.append('updated_by', user_id)

        NlmtTripSheetClosureService.updateSettlementClosureRejection(id, formData)
          .then((res) => {
            // alert('success')
            setFetch(true)
            if (res.status == 200) {
              if (rejectionType == 1) {
                toast.warning('Settlement Closure : Expense Rejected!')
              } else {
                toast.warning('Settlement Closure : Income Rejected!')
              }
              navigation('/NlmtTSIncomeClosureHome')
            } else {
              toast.warning('Something Went Wrong !')
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
      } else {
        const formData = new FormData()

        if (tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id != '3') {
          formData.append(
            'driver_advance',
            tripInfo.advance_payment_info ? tripInfo.advance_payment_info.advance_payment : 0
          )
          formData.append('driver_expense', driver_expense_calculation() || 0)
          formData.append('rj_receipt_amount', rj_receipt_amount_calculation() || 0)
          formData.append('total_amount', total_amount_calculation() || 0)
          formData.append('balance_amount', balance_amount_calculation() || 0)
        }

        formData.append('income', totalTripIncome)
        formData.append('profit_and_loss', totalTripPL)
        formData.append('income_remarks', values.income_remarks)

        formData.append('tripsheet_is_settled', 6)
        formData.append('updated_by', user_id)

        //ADD-ON INFO DATA SEND
        formData.append('trip_data_info', JSON.stringify(tripInfo))
        formData.append('trip_shipment_info', JSON.stringify(shipmentInfo))
        formData.append('trip_rj_info', JSON.stringify(rjsoInfo))
        formData.append('trip_sto_info', JSON.stringify(tripStoData))

        TripSheetClosureService.updateIncomeClosureAcception(id, formData)
          .then((res) => {
            // alert('success')
            setFetch(true)
            if (res.status == 200) {
              toast.success('Income Closure Submitted!')
              navigation('/NlmtTSIncomeClosureHome')
            } else {
              toast.warning('Something Went Wrong !')
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
    }

    useEffect(() => {
      if (shipmentInfo || rjsoInfo || tripStoData || tripOthersStoData) {
        console.log(shipmentInfo, 'tripFgsalesData')
        console.log(rjsoInfo, 'tripRjsoData')
        console.log(tripStoData, 'tripStoData')
        console.log(tripOthersStoData, 'tripOthersStoData')

        let foods_division_data = []
        let rake_foods_division_data = []
        let consumer_division_data = []
        let mmd_division_data1 = []
        let ifoods_division_data = []
        let minerals_division_data = []
        let detergents_division_data = []
        let service_division_data = []

        /*===============================FG_SALES PART START==================================== */

        if (shipmentInfo.length > 0) {
          shipmentInfo.map((val1, ind1) => {

            console.log(divisionFinder(val1),'divisionFinder(val1)')
            if(divisionFinder(val1) == 'NLCD'){
              consumer_division_data.push(val1)
            } else {
              foods_division_data.push(val1)
            }
          })
        }

        /*===============================STO PART START==================================== */

        if (tripStoData.length > 0) {
          tripStoData.map((val2, ind2) => {
            if (val2.sto_delivery_division == 'CONSUMER') {
              consumer_division_data.push(val2)
            } else if (val2.sto_delivery_division == 'MMD') {
              mmd_division_data1.push(val2)
            } else {
              foods_division_data.push(val2)
            }
          })
        }

        /*=============================== OTHERS PART START==================================== */

        if (tripOthersStoData.length > 0) {
          tripOthersStoData.map((val3, ind3) => {
            let trip_div = othersDivisionFinder(val3.others_vr_request_id)
            console.log(val3,'tripOthersStoData-',ind3)
            console.log(trip_div,'tripOthersStoData-',ind3)
            if (trip_div == 'FOODS') {
              foods_division_data.push(val3)
            } else if (trip_div == 'CONSUMER') {
              consumer_division_data.push(val3)
            } else if (trip_div == 'MMD') {
              mmd_division_data1.push(val3)
            } else if (trip_div == 'DETERGENTS') {
              detergents_division_data.push(val3)
            } else if (trip_div == 'MINERALS') {
              minerals_division_data.push(val3)
            } else if (trip_div == 'IFOODS') {
              ifoods_division_data.push(val3)
            } else if (trip_div == 'SERVICE'){
              service_division_data.push(val3)
            }
          })
        }

        setFoodsDivisionData(foods_division_data)
        // setRakeFoodsDivisionData(rake_foods_division_data)
        setConsumerDivisionData(consumer_division_data)
        setMmdDivisionData(mmd_division_data1)
        setIfoodDivisionData(ifoods_division_data)
        setMineralDivisionData(minerals_division_data)
        setDetergentDivisionData(detergents_division_data)
        setServiceDivisionData(service_division_data)

        console.log(consumer_division_data, 'consumer_division_data')
        console.log(foods_division_data, 'foods_division_data')
        console.log(rake_foods_division_data, 'rake_foods_division_data')
        console.log(rjsoInfo, 'rjso_customer_data')
        console.log(mmd_division_data1, 'mmd_division_data1')
        console.log(ifoods_division_data, 'ifoods_division_data')
        console.log(minerals_division_data, 'minerals_division_data')
        console.log(detergents_division_data, 'detergents_division_data')
        console.log(service_division_data, 'service_division_data')
      }
    }, [shipmentInfo, rjsoInfo, tripStoData, tripOthersStoData, vehicleRequestsData])

    const journey_type_finder = (data) => {
      console.log(data,'journey_type_finder-data1')
      let jt = 'RM_STO'
      if (data.shipment_no) {
        jt = 'FG_SALES'
      } else if (data.sto_delivery_no && data.sto_delivery_type == '1') {
        jt = 'FG_STO'
      } else if (data.rake_migo_no && data.sto_delivery_type == '4') {
        jt = 'FCI'
      } else if (data.sto_delivery_no == '' && data.sto_delivery_type == '2' && data.rm_type == '2' && data.sto_delivery_division == 'FOODS') {
        jt = 'RAKE_FOODS'
      } else if (data.sto_delivery_no == '' && data.sto_delivery_type == '2' && data.rm_type == '2' && data.sto_delivery_division == 'MMD') {
        jt = 'RAKE_MMD'
      } else if (data.sto_delivery_no && data.sto_delivery_type == '3') {

        let trip_division = othersDivisionFinder(data.others_vr_request_id)

        if (trip_division == 'FOODS') {
          jt = 'FD_OTHERS'
        } else if (trip_division == 'CONSUMER') {
          jt = 'CD_OTHERS'
        } else if (trip_division == 'MMD') {
          jt = 'MMD_OTHERS'
        } else if (trip_division == 'DETERGENTS') {
          jt = 'DV_OTHERS'
        } else if (trip_division == 'MINERALS') {
          jt = 'MD_OTHERS'
        } else if (trip_division == 'IFOODS') {
          jt = 'IF_OTHERS'
        } else if (trip_division == 'SERVICE'){
          jt = 'SD_OTHERS'
        }

      }
      console.log(data.sto_delivery_no,'journey_type_finder-data2')
      console.log(data.sto_delivery_type,'journey_type_finder-data2')
      console.log(data.rm_type,'journey_type_finder-data2')
      console.log(jt,'journey_type_finder-data2')
      return jt
    }

    const customElement = (data) => {
      let limn = ''
      data.map((vk,kk)=>{
        limn = limn +
          `<tr key=${kk}>
            <td>${kk+1}</td>
            <td>${vk.DIVISION}</td>
            <td>${vk.POST_TYPE}</td>
            <td>${vk.DOCUMENT_NO ? vk.DOCUMENT_NO : '-'}</td>
            <td className=${vk.STATUS == '1' ? "bg-success" : "bg-warning"}>${vk.STATUS == '1' ? "Success" : "Failed"}</td>
            <td>${vk.MESSAGE}</td>
          </tr>`
      })
      return limn
    }

    const latest_trip_settlement_db_final_update = (sap_response_value,div_count) => {
      const formData = new FormData()
      formData.append('income', totalTripIncome)
      formData.append('income_division_count', div_count)
      formData.append('profit_and_loss', totalTripPL)
      formData.append('settlement_remarks', values.settlement_remarks)
      formData.append('income_posting_date', values.income_posting_date)
      formData.append('tripsheet_is_settled', 5)
      formData.append('updated_by', user_id)
      formData.append('settled_by', user_id)
      formData.append('sap_response', JSON.stringify(sap_response_value))

      if (tripsettlementData.registered_diesel_amount == 0 && tdaDieselInfo && tdaDieselInfo != '0') {
        let expens1 = Number(tripsettlementData.expense) + Number(tdaDieselInfo)
        formData.append('registered_diesel_amount', tdaDieselInfo)
        formData.append('expense', expens1)
      }

      //ADD-ON INFO DATA SEND
      formData.append('trip_data_info', JSON.stringify(tripInfo))
      formData.append('trip_shipment_info', JSON.stringify(shipmentInfo))
      formData.append('trip_rj_info', JSON.stringify(rjsoInfo))
      formData.append('trip_sto_info', JSON.stringify(tripStoData))
      formData.append('trip_others_info', JSON.stringify(tripOthersStoData))

      return formData
    }

    const trip_settlement_db_final_update = (
      DocumentNo,
      Division,
      TripsheetNo,
      trip_journey_available,
      RJSO_NO
    ) => {
      const formData = new FormData()
      formData.append('income', totalTripIncome)
      formData.append('profit_and_loss', totalTripPL)
      formData.append('settlement_remarks', values.settlement_remarks)
      formData.append('income_posting_date', values.income_posting_date)
      formData.append('tripsheet_is_settled', 5)
      formData.append('updated_by', user_id)
      formData.append('settled_by', user_id)
      formData.append('trip_journey_available', trip_journey_available)

      if (tripsettlementData.registered_diesel_amount == 0 && tdaDieselInfo && tdaDieselInfo != '0') {
        let expens1 = Number(tripsettlementData.expense) + Number(tdaDieselInfo)
        formData.append('registered_diesel_amount', tdaDieselInfo)
        formData.append('expense', expens1)
      }

      //ADD-ON INFO DATA SEND
      formData.append('trip_data_info', JSON.stringify(tripInfo))
      formData.append('trip_shipment_info', JSON.stringify(shipmentInfo))
      formData.append('trip_rj_info', JSON.stringify(rjsoInfo))
      formData.append('trip_sto_info', JSON.stringify(tripStoData))
      formData.append('income_rj_sap_document_no', DocumentNo)
      formData.append('income_rj_so_no', RJSO_NO)

      return formData
    }

    const sendAllIncomeToSAP = () => {
      console.log(foodsDivisionData, 'foodsDivisionData')
      console.log(ifoodDivisionData, 'ifoodDivisionData')
      console.log(mmdDivisionData, 'mmdDivisionData')
      console.log(consumerDivisionData, 'consumerDivisionData')
      console.log(tripRjsoData, 'rjso_customer_data')
      console.log(rjsoInfo, 'rjso_customer_data')

      const having_div_array = []

      /* 7 Divisons (FOODS,CONSUMER,MMD,IFOODS,MINERALS,DETERGENTS,SERVICE) */
      const income_division_array = ['FOODS','CONSUMER','MMD','IFOODS','MINERALS','DETERGENTS','SERVICE']
      for(let i = 0;i<7;i++){
        having_div_array[i] = {'div':income_division_array[i],'base':0,'additional':0}
      }

      console.log(having_div_array,'having_div_array')

      setFetch(false)
      let formData = ''

      /*============================= FOODS DIVISION PART START =============================*/

      var foods_division_base_data = {}
      var foods_division_data_seq = []
      var foods_division_additional_data = {}

      /* Set Foods Division Income Data via Trip Foods Division Journies by Loop */
      for (var i = 0; i < foodsDivisionData.length; i++) {
        console.log(foodsDivisionData[i],'foodsDivisionData[i]',i)
        let add_condition = tripAdditionalFreightHaving(foodsDivisionData[i])

        if(add_condition == 'YES'){

          /* Additional Element Forming */
          foods_division_additional_data.VEHICLE_NO = tripInfo.vehicle_number
          foods_division_additional_data.TRIPSHEET_NO = tripInfo.tripsheet_info.nlmt_tripsheet_no
          foods_division_additional_data.DIVISION = 'FOODS'
          foods_division_additional_data.DOC_POST = 'ADDITIONAL'
          foods_division_additional_data.JOURNEY_TYPE = journey_type_finder(foodsDivisionData[i])
          foods_division_additional_data.DOCUMENT_NO = foodsDivisionData[i].shipment_no
            ? foodsDivisionData[i].shipment_no
            : (foodsDivisionData[i].sto_delivery_no == '' ? foodsDivisionData[i].rake_migo_no : foodsDivisionData[i].sto_delivery_no)

          if (tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id == 3) {
            if (tripInfo.tripsheet_info.purpose == 3) {
              foods_division_additional_data.HIRE_FRE_VEN_BALANCE = totalTripIncome
            }
          } else {
            foods_division_additional_data.HIRE_FRE_VEN_BALANCE = 0
          }

          foods_division_additional_data.POST_DATE = values.income_posting_date
          foods_division_additional_data.BASE_FREIGHT = 0
          foods_division_additional_data.HALTING_CHARG = foodsDivisionData[i].income_halting_charges_input
            ? foodsDivisionData[i].income_halting_charges_input
            : foodsDivisionData[i].income_halting_charges
            ? foodsDivisionData[i].income_halting_charges
            : 0
          foods_division_additional_data.SUBDELIVERY_CHARG = foodsDivisionData[i].income_sub_delivery_charges_input
            ? foodsDivisionData[i].income_sub_delivery_charges_input
            : foodsDivisionData[i].income_sub_delivery_charges
            ? foodsDivisionData[i].income_sub_delivery_charges
            : 0
          foods_division_additional_data.UNLOADING_CHARG = foodsDivisionData[i].income_unloading_charges_input
            ? foodsDivisionData[i].income_unloading_charges_input
            : foodsDivisionData[i].income_unloading_charges
            ? foodsDivisionData[i].income_unloading_charges
            : 0
          foods_division_additional_data.WEIGHMENT_CHARG = foodsDivisionData[i].income_weighment_chares_input
            ? foodsDivisionData[i].income_weighment_chares_input
            : foodsDivisionData[i].income_weighment_chares
            ? foodsDivisionData[i].income_weighment_chares
            : 0
          foods_division_additional_data.LOW_TONAGE_CHARG = foodsDivisionData[i].income_low_tonage_charges_input
            ? foodsDivisionData[i].income_low_tonage_charges_input
            : foodsDivisionData[i].income_low_tonage_charges
            ? foodsDivisionData[i].income_low_tonage_charges
            : 0
          foods_division_additional_data.TOLL_CHARG = foodsDivisionData[i].income_toll_charges_input
            ? foodsDivisionData[i].income_toll_charges_input
            : foodsDivisionData[i].income_toll_charges
            ? foodsDivisionData[i].income_toll_charges
            : 0
          foods_division_additional_data.OTHER_FREIGHT = foodsDivisionData[i].income_others_charges_input
            ? foodsDivisionData[i].income_others_charges_input
            : foodsDivisionData[i].income_others_charges
            ? foodsDivisionData[i].income_others_charges
            : 0
          foods_division_additional_data.TOT_FRE_INC = total_journey_income(foodsDivisionData[i],2)

        }

        /* Base Element Forming */
        foods_division_base_data.VEHICLE_NO = tripInfo.vehicle_number
        foods_division_base_data.TRIPSHEET_NO = tripInfo.tripsheet_info.nlmt_tripsheet_no
        foods_division_base_data.DIVISION = 'FOODS'
        foods_division_base_data.DOC_POST = 'BASE'
        foods_division_base_data.JOURNEY_TYPE = journey_type_finder(foodsDivisionData[i])
        foods_division_base_data.DOCUMENT_NO = foodsDivisionData[i].shipment_no
          ? foodsDivisionData[i].shipment_no
          : (foodsDivisionData[i].sto_delivery_no == '' ? foodsDivisionData[i].rake_migo_no : foodsDivisionData[i].sto_delivery_no)

        if (tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id == 3) {
          if (tripInfo.tripsheet_info.purpose == 3) {
            foods_division_base_data.HIRE_FRE_VEN_BALANCE = totalTripIncome
          }
        } else {
          foods_division_base_data.HIRE_FRE_VEN_BALANCE = 0
        }

        foods_division_base_data.POST_DATE = values.income_posting_date
        foods_division_base_data.BASE_FREIGHT = Number(foodsDivisionData[i].income_base_charges_input) > 0
          ? foodsDivisionData[i].income_base_charges_input
          : foodsDivisionData[i].shipment_freight_amount
          ? foodsDivisionData[i].shipment_freight_amount
          : foodsDivisionData[i].freight_amount
          ? foodsDivisionData[i].freight_amount
          : 0
        foods_division_base_data.HALTING_CHARG = 0
        foods_division_base_data.SUBDELIVERY_CHARG = 0
        foods_division_base_data.UNLOADING_CHARG = 0
        foods_division_base_data.WEIGHMENT_CHARG = 0
        foods_division_base_data.LOW_TONAGE_CHARG = 0
        foods_division_base_data.TOLL_CHARG = 0
        foods_division_base_data.OTHER_FREIGHT = 0
        foods_division_base_data.TOT_FRE_INC = total_journey_income(foodsDivisionData[i],1)


        if(add_condition == 'YES'){
          having_div_array[0].additional = 1
          foods_division_data_seq.push(foods_division_base_data)
          foods_division_data_seq.push(foods_division_additional_data)
        } else {
          foods_division_data_seq.push(foods_division_base_data)
        }
        having_div_array[0].base = 1

        foods_division_base_data = {}
        foods_division_additional_data = {}
      }

      /*============================= FOODS DIVISION PART END =============================*/
      /*============================= MMD DIVISION PART START =============================*/

      var mmd_division_base_data = {}
      var mmd_division_data_seq = []
      var mmd_division_additional_data = {}

      /* Set MMD Division Income Data via Trip MMD Division Journies by Loop */
      for (var i = 0; i < mmdDivisionData.length; i++) {
        console.log(mmdDivisionData[i],'mmdDivisionData[i]',i)
        let add_condition = tripAdditionalFreightHaving(mmdDivisionData[i])

        if(add_condition == 'YES'){

          /* Additional Element Forming */
          mmd_division_additional_data.VEHICLE_NO = tripInfo.vehicle_number
          mmd_division_additional_data.TRIPSHEET_NO = tripInfo.tripsheet_info.nlmt_tripsheet_no
          mmd_division_additional_data.DIVISION = 'MMD'
          mmd_division_additional_data.DOC_POST = 'ADDITIONAL'
          mmd_division_additional_data.JOURNEY_TYPE = journey_type_finder(mmdDivisionData[i])
          mmd_division_additional_data.DOCUMENT_NO = mmdDivisionData[i].rake_migo_no
          mmd_division_additional_data.HIRE_FRE_VEN_BALANCE = 0

          mmd_division_additional_data.BASE_FREIGHT = 0
          mmd_division_additional_data.HALTING_CHARG = mmdDivisionData[i].income_halting_charges_input
            ? mmdDivisionData[i].income_halting_charges_input
            : mmdDivisionData[i].income_halting_charges
            ? mmdDivisionData[i].income_halting_charges
            : 0
          mmd_division_additional_data.SUBDELIVERY_CHARG = mmdDivisionData[i].income_sub_delivery_charges_input
            ? mmdDivisionData[i].income_sub_delivery_charges_input
            : mmdDivisionData[i].income_sub_delivery_charges
            ? mmdDivisionData[i].income_sub_delivery_charges
            : 0
          mmd_division_additional_data.UNLOADING_CHARG = mmdDivisionData[i].income_unloading_charges_input
            ? mmdDivisionData[i].income_unloading_charges_input
            : mmdDivisionData[i].income_unloading_charges
            ? mmdDivisionData[i].income_unloading_charges
            : 0
          mmd_division_additional_data.WEIGHMENT_CHARG = mmdDivisionData[i].income_weighment_chares_input
            ? mmdDivisionData[i].income_weighment_chares_input
            : mmdDivisionData[i].income_weighment_chares
            ? mmdDivisionData[i].income_weighment_chares
            : 0
          mmd_division_additional_data.LOW_TONAGE_CHARG = mmdDivisionData[i].income_low_tonage_charges_input
            ? mmdDivisionData[i].income_low_tonage_charges_input
            : mmdDivisionData[i].income_low_tonage_charges
            ? mmdDivisionData[i].income_low_tonage_charges
            : 0
            mmd_division_additional_data.TOLL_CHARG = mmdDivisionData[i].income_toll_charges_input
            ? mmdDivisionData[i].income_toll_charges_input
            : mmdDivisionData[i].income_toll_charges
            ? mmdDivisionData[i].income_toll_charges
            : 0
          mmd_division_additional_data.OTHER_FREIGHT = mmdDivisionData[i].income_others_charges_input
            ? mmdDivisionData[i].income_others_charges_input
            : mmdDivisionData[i].income_others_charges
            ? mmdDivisionData[i].income_others_charges
            : 0
          mmd_division_additional_data.TOT_FRE_INC = total_journey_income(mmdDivisionData[i],2)
          mmd_division_additional_data.POST_DATE = values.income_posting_date
          mmd_division_additional_data.MMD_REMARK = values.settlement_remarks

        }

        /* Base Element Forming */
        mmd_division_base_data.VEHICLE_NO = tripInfo.vehicle_number
        mmd_division_base_data.TRIPSHEET_NO = tripInfo.tripsheet_info.nlmt_tripsheet_no
        mmd_division_base_data.DIVISION = 'MMD'
        mmd_division_base_data.DOC_POST = 'BASE'
        mmd_division_base_data.JOURNEY_TYPE = journey_type_finder(mmdDivisionData[i])
        mmd_division_base_data.DOCUMENT_NO = mmdDivisionData[i].rake_migo_no

        mmd_division_base_data.HIRE_FRE_VEN_BALANCE = 0
        mmd_division_base_data.POST_DATE = values.income_posting_date
        mmd_division_additional_data.MMD_REMARK = values.settlement_remarks
        mmd_division_base_data.BASE_FREIGHT = Number(mmdDivisionData[i].income_base_charges_input) > 0
            ? mmdDivisionData[i].income_base_charges_input
            : mmdDivisionData[i].shipment_freight_amount
            ? mmdDivisionData[i].shipment_freight_amount
            : mmdDivisionData[i].freight_amount
            ? mmdDivisionData[i].freight_amount
            : 0
        mmd_division_base_data.HALTING_CHARG = 0
        mmd_division_base_data.SUBDELIVERY_CHARG = 0
        mmd_division_base_data.UNLOADING_CHARG = 0
        mmd_division_base_data.WEIGHMENT_CHARG = 0
        mmd_division_base_data.LOW_TONAGE_CHARG = 0
        mmd_division_base_data.TOLL_CHARG = 0
        mmd_division_base_data.OTHER_FREIGHT = 0
        mmd_division_base_data.TOT_FRE_INC = total_journey_income(mmdDivisionData[i],1)

        if(mmdDivisionData[i].rake_migo_no != ''){
          if(add_condition == 'YES'){
            having_div_array[2].additional = 1
            mmd_division_data_seq.push(mmd_division_base_data)
            mmd_division_data_seq.push(mmd_division_additional_data)
          } else {
            mmd_division_data_seq.push(mmd_division_base_data)
          }
          having_div_array[2].base = 1

        }

        mmd_division_base_data = {}
        mmd_division_additional_data = {}
      }

      /*============================= MMD DIVISION PART END =============================*/

      /*============================= CONSUMER DIVISION PART START =============================*/

      var consumer_division_base_data = {}
      var consumer_division_data_seq = []
      var consumer_division_additional_data = {}

      /* Set Consumer Division Income Data via Trip Consumer Division Journies by Loop */
      for (var i = 0; i < consumerDivisionData.length; i++) {

        console.log(consumerDivisionData[i],'consumerDivisionData[i]',i)
        let add_condition = tripAdditionalFreightHaving(consumerDivisionData[i])

        if(add_condition == 'YES'){

          /* Additional Element Forming */
          consumer_division_additional_data.VEHICLE_NO = tripInfo.vehicle_number
          consumer_division_additional_data.TRIPSHEET_NO = tripInfo.tripsheet_info.nlmt_tripsheet_no
          consumer_division_additional_data.DIVISION = 'CONSUMER'
          consumer_division_additional_data.DOC_POST = 'ADDITIONAL'
          consumer_division_additional_data.JOURNEY_TYPE = journey_type_finder(consumerDivisionData[i])
          consumer_division_additional_data.DOCUMENT_NO = consumerDivisionData[i].shipment_no
            ? consumerDivisionData[i].shipment_no
            : consumerDivisionData[i].sto_delivery_no

          if (tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id == 3) {
            if (tripInfo.tripsheet_info.purpose == 3) {
              consumer_division_additional_data.HIRE_FRE_VEN_BALANCE = totalTripIncome
            }
          } else {
            consumer_division_additional_data.HIRE_FRE_VEN_BALANCE = 0
          }

          consumer_division_additional_data.TOT_FRE_INC = total_journey_income(consumerDivisionData[i],2)
          consumer_division_additional_data.POST_DATE = values.income_posting_date
          consumer_division_additional_data.BASE_FREIGHT = 0

          consumer_division_additional_data.HALTING_CHARG = consumerDivisionData[i].income_halting_charges_input
            ? consumerDivisionData[i].income_halting_charges_input
            : consumerDivisionData[i].income_halting_charges
            ? consumerDivisionData[i].income_halting_charges
            : 0
          consumer_division_additional_data.SUBDELIVERY_CHARG = consumerDivisionData[i]
            .income_sub_delivery_charges_input
            ? consumerDivisionData[i].income_sub_delivery_charges_input
            : consumerDivisionData[i].income_sub_delivery_charges
            ? consumerDivisionData[i].income_sub_delivery_charges
            : 0
          consumer_division_additional_data.UNLOADING_CHARG = consumerDivisionData[i]
            .income_unloading_charges_input
            ? consumerDivisionData[i].income_unloading_charges_input
            : consumerDivisionData[i].income_unloading_charges
            ? consumerDivisionData[i].income_unloading_charges
            : 0
          consumer_division_additional_data.WEIGHMENT_CHARG = consumerDivisionData[i].income_weighment_chares_input
            ? consumerDivisionData[i].income_weighment_chares_input
            : consumerDivisionData[i].income_weighment_chares
            ? consumerDivisionData[i].income_weighment_chares
            : 0
          consumer_division_additional_data.LOW_TONAGE_CHARG = consumerDivisionData[i]
            .income_low_tonage_charges_input
            ? consumerDivisionData[i].income_low_tonage_charges_input
            : consumerDivisionData[i].income_low_tonage_charges
            ? consumerDivisionData[i].income_low_tonage_charges
            : 0
          consumer_division_additional_data.TOLL_CHARG = consumerDivisionData[i]
            .income_toll_charges_input
            ? consumerDivisionData[i].income_toll_charges_input
            : consumerDivisionData[i].income_toll_charges
            ? consumerDivisionData[i].income_toll_charges
            : 0
          consumer_division_additional_data.OTHER_FREIGHT = consumerDivisionData[i].income_others_charges_input
            ? consumerDivisionData[i].income_others_charges_input
            : consumerDivisionData[i].income_others_charges
            ? consumerDivisionData[i].income_others_charges
            : 0

        }

        /* Base Element Forming */
        consumer_division_base_data.VEHICLE_NO = tripInfo.vehicle_number
        consumer_division_base_data.TRIPSHEET_NO = tripInfo.tripsheet_info.nlmt_tripsheet_no
        consumer_division_base_data.DIVISION = 'CONSUMER'
        consumer_division_base_data.DOC_POST = 'BASE'
        consumer_division_base_data.JOURNEY_TYPE = journey_type_finder(consumerDivisionData[i])
        consumer_division_base_data.DOCUMENT_NO = consumerDivisionData[i].shipment_no
          ? consumerDivisionData[i].shipment_no
          : consumerDivisionData[i].sto_delivery_no

        if (tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id == 3) {
          if (tripInfo.tripsheet_info.purpose == 3) {
            consumer_division_base_data.HIRE_FRE_VEN_BALANCE = totalTripIncome
          }
        } else {
          consumer_division_base_data.HIRE_FRE_VEN_BALANCE = 0
        }

        consumer_division_base_data.POST_DATE = values.income_posting_date
        consumer_division_base_data.BASE_FREIGHT = Number(consumerDivisionData[i].income_base_charges_input) > 0
          ? consumerDivisionData[i].income_base_charges_input
          : consumerDivisionData[i].shipment_freight_amount
          ? consumerDivisionData[i].shipment_freight_amount
          : consumerDivisionData[i].freight_amount
          ? consumerDivisionData[i].freight_amount
          : 0
        consumer_division_base_data.HALTING_CHARG = 0
        consumer_division_base_data.SUBDELIVERY_CHARG = 0
        consumer_division_base_data.UNLOADING_CHARG = 0
        consumer_division_base_data.WEIGHMENT_CHARG = 0
        consumer_division_base_data.LOW_TONAGE_CHARG = 0
        consumer_division_base_data.TOLL_CHARG = 0
        consumer_division_base_data.OTHER_FREIGHT = 0
        consumer_division_base_data.TOT_FRE_INC = total_journey_income(consumerDivisionData[i],1)

        if(add_condition == 'YES'){
          having_div_array[1].additional = 1
          consumer_division_data_seq.push(consumer_division_base_data)
          consumer_division_data_seq.push(consumer_division_additional_data)
        } else {
          consumer_division_data_seq.push(consumer_division_base_data)
        }
        having_div_array[1].base = 1

        consumer_division_base_data = {}
        consumer_division_additional_data = {}

      }

      /*============================= CONSUMER DIVISION PART END =============================*/

      /*============================= RETURN JOURNEY PART START =============================*/

      var rj_customer_data = {}
      var rj_customer_data_seq = []

      /* Set Foods Division Income Data via Trip Foods Division Journies by Loop */
      for (var i = 0; i < rjsoInfo.length; i++) {
        rj_customer_data.VEHICLE_NO = tripInfo.vehicle_number
        rj_customer_data.TRIPSHEET_NO = tripInfo.tripsheet_info.nlmt_tripsheet_no
        rj_customer_data.vbeln = rjsoInfo[i].rj_so_no
        rj_customer_data.kunnr = rjsoInfo[i].customer_code
        // rj_customer_data.netwr = rjsoInfo[i].balance_payment_received == 1 ? rjsoInfo[i].freight_income : rjsoInfo[i].advance_amount
        // rj_customer_data.netwr =
        //   Number(rjsoInfo[i].income_base_charges_input) > 0
        //     ? rjsoInfo[i].income_base_charges_input
        //     : rjsoInfo[i].freight_income
        rj_customer_data.netwr = rjsoInfo[i].freight_income
        rj_customer_data.HALTING_CHARG = rjsoInfo[i].income_halting_charges_input
          ? rjsoInfo[i].income_halting_charges_input
          : rjsoInfo[i].income_halting_charges
          ? rjsoInfo[i].income_halting_charges
          : 0
        rj_customer_data.SUBDELIVERY_CHARG = rjsoInfo[i].income_sub_delivery_charges_input
          ? rjsoInfo[i].income_sub_delivery_charges_input
          : rjsoInfo[i].income_sub_delivery_charges
          ? rjsoInfo[i].income_sub_delivery_charges
          : 0
        rj_customer_data.UNLOADING_CHARG = rjsoInfo[i].income_unloading_charges_input
          ? rjsoInfo[i].income_unloading_charges_input
          : rjsoInfo[i].income_unloading_charges
          ? rjsoInfo[i].income_unloading_charges
          : 0
        rj_customer_data.WEIGHMENT_CHARG = rjsoInfo[i].income_weighment_chares_input
          ? rjsoInfo[i].income_weighment_chares_input
          : rjsoInfo[i].income_weighment_chares
          ? rjsoInfo[i].income_weighment_chares
          : 0
        rj_customer_data.LOW_TONAGE_CHARG = rjsoInfo[i].income_low_tonage_charges_input
          ? rjsoInfo[i].income_low_tonage_charges_input
          : rjsoInfo[i].income_low_tonage_charges
          ? rjsoInfo[i].income_low_tonage_charges
          : 0
        rj_customer_data.TOLL_CHARG = rjsoInfo[i].income_toll_charges_input
          ? rjsoInfo[i].income_toll_charges_input
          : rjsoInfo[i].income_toll_charges
          ? rjsoInfo[i].income_toll_charges
          : 0
        rj_customer_data.OTHER_FREIGHT = rjsoInfo[i].income_others_charges_input
          ? rjsoInfo[i].income_others_charges_input
          : rjsoInfo[i].income_others_charges
          ? rjsoInfo[i].income_others_charges
          : 0

        rj_customer_data.InvoiceNo = rjsoInfo[i].rj_invoice_no ? rjsoInfo[i].rj_invoice_no : ''
        rj_customer_data.POST_DATE = values.income_posting_date
        rj_customer_data_seq[i] = rj_customer_data

        rj_customer_data = {}
      }

      /*============================= RETURN JOURNEY PART END =============================*/

      /*============================= IFOODS DIVISION PART START =============================*/

      var ifoods_division_base_data = {}
      var ifoods_division_data_seq = []
      var ifoods_division_additional_data = {}

      /* Set Foods Division Income Data via Trip Foods Division Journies by Loop */
      for (var i = 0; i < ifoodDivisionData.length; i++) {
        console.log(ifoodDivisionData[i],'ifoodDivisionData[i]',i)
        let add_condition = tripAdditionalFreightHaving(ifoodDivisionData[i])

        if(add_condition == 'YES'){

          /* Additional Element Forming */
          ifoods_division_additional_data.VEHICLE_NO = tripInfo.vehicle_number
          ifoods_division_additional_data.TRIPSHEET_NO = tripInfo.tripsheet_info.nlmt_tripsheet_no
          ifoods_division_additional_data.DIVISION = 'IFOODS'
          ifoods_division_additional_data.DOC_POST = 'ADDITIONAL'
          ifoods_division_additional_data.JOURNEY_TYPE = journey_type_finder(ifoodDivisionData[i])
          ifoods_division_additional_data.DOCUMENT_NO = ifoodDivisionData[i].shipment_no
            ? ifoodDivisionData[i].shipment_no
            : (ifoodDivisionData[i].sto_delivery_no == '' ? ifoodDivisionData[i].rake_migo_no : ifoodDivisionData[i].sto_delivery_no)

          if (tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id == 3) {
            if (tripInfo.tripsheet_info.purpose == 3) {
              ifoods_division_additional_data.HIRE_FRE_VEN_BALANCE = totalTripIncome
            }
          } else {
            ifoods_division_additional_data.HIRE_FRE_VEN_BALANCE = 0
          }

          ifoods_division_additional_data.POST_DATE = values.income_posting_date
          ifoods_division_additional_data.BASE_FREIGHT = 0
          ifoods_division_additional_data.HALTING_CHARG = ifoodDivisionData[i].income_halting_charges_input
            ? ifoodDivisionData[i].income_halting_charges_input
            : ifoodDivisionData[i].income_halting_charges
            ? ifoodDivisionData[i].income_halting_charges
            : 0
          ifoods_division_additional_data.SUBDELIVERY_CHARG = ifoodDivisionData[i].income_sub_delivery_charges_input
            ? ifoodDivisionData[i].income_sub_delivery_charges_input
            : ifoodDivisionData[i].income_sub_delivery_charges
            ? ifoodDivisionData[i].income_sub_delivery_charges
            : 0
          ifoods_division_additional_data.UNLOADING_CHARG = ifoodDivisionData[i].income_unloading_charges_input
            ? ifoodDivisionData[i].income_unloading_charges_input
            : ifoodDivisionData[i].income_unloading_charges
            ? ifoodDivisionData[i].income_unloading_charges
            : 0
          ifoods_division_additional_data.WEIGHMENT_CHARG = ifoodDivisionData[i].income_weighment_chares_input
            ? ifoodDivisionData[i].income_weighment_chares_input
            : ifoodDivisionData[i].income_weighment_chares
            ? ifoodDivisionData[i].income_weighment_chares
            : 0
          ifoods_division_additional_data.LOW_TONAGE_CHARG = ifoodDivisionData[i].income_low_tonage_charges_input
            ? ifoodDivisionData[i].income_low_tonage_charges_input
            : ifoodDivisionData[i].income_low_tonage_charges
            ? ifoodDivisionData[i].income_low_tonage_charges
            : 0
          ifoods_division_additional_data.TOLL_CHARG = ifoodDivisionData[i].income_toll_charges_input
            ? ifoodDivisionData[i].income_toll_charges_input
            : ifoodDivisionData[i].income_toll_charges
            ? ifoodDivisionData[i].income_toll_charges
            : 0
          ifoods_division_additional_data.OTHER_FREIGHT = ifoodDivisionData[i].income_others_charges_input
            ? ifoodDivisionData[i].income_others_charges_input
            : ifoodDivisionData[i].income_others_charges
            ? ifoodDivisionData[i].income_others_charges
            : 0
          ifoods_division_additional_data.TOT_FRE_INC = total_journey_income(ifoodDivisionData[i],2)

        }

        /* Base Element Forming */
        ifoods_division_base_data.VEHICLE_NO = tripInfo.vehicle_number
        ifoods_division_base_data.TRIPSHEET_NO = tripInfo.tripsheet_info.nlmt_tripsheet_no
        ifoods_division_base_data.DIVISION = 'IFOODS'
        ifoods_division_base_data.DOC_POST = 'BASE'
        ifoods_division_base_data.JOURNEY_TYPE = journey_type_finder(ifoodDivisionData[i])
        ifoods_division_base_data.DOCUMENT_NO = ifoodDivisionData[i].shipment_no
          ? ifoodDivisionData[i].shipment_no
          : (ifoodDivisionData[i].sto_delivery_no == '' ? ifoodDivisionData[i].rake_migo_no : ifoodDivisionData[i].sto_delivery_no)

        if (tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id == 3) {
          if (tripInfo.tripsheet_info.purpose == 3) {
            ifoods_division_base_data.HIRE_FRE_VEN_BALANCE = totalTripIncome
          }
        } else {
          ifoods_division_base_data.HIRE_FRE_VEN_BALANCE = 0
        }

        ifoods_division_base_data.POST_DATE = values.income_posting_date
        ifoods_division_base_data.BASE_FREIGHT = Number(ifoodDivisionData[i].income_base_charges_input) > 0
          ? ifoodDivisionData[i].income_base_charges_input
          : ifoodDivisionData[i].shipment_freight_amount
          ? ifoodDivisionData[i].shipment_freight_amount
          : ifoodDivisionData[i].freight_amount
          ? ifoodDivisionData[i].freight_amount
          : 0
        ifoods_division_base_data.HALTING_CHARG = 0
        ifoods_division_base_data.SUBDELIVERY_CHARG = 0
        ifoods_division_base_data.UNLOADING_CHARG = 0
        ifoods_division_base_data.WEIGHMENT_CHARG = 0
        ifoods_division_base_data.LOW_TONAGE_CHARG = 0
        ifoods_division_base_data.TOLL_CHARG = 0
        ifoods_division_base_data.OTHER_FREIGHT = 0
        ifoods_division_base_data.TOT_FRE_INC = total_journey_income(ifoodDivisionData[i],1)


        if(add_condition == 'YES'){
          having_div_array[3].additional = 1
          ifoods_division_data_seq.push(ifoods_division_base_data)
          ifoods_division_data_seq.push(ifoods_division_additional_data)
        } else {
          ifoods_division_data_seq.push(ifoods_division_base_data)
        }
        having_div_array[3].base = 1

        ifoods_division_base_data = {}
        ifoods_division_additional_data = {}
      }

      /*============================= IFOODS DIVISION PART END =============================*/

      /*============================= MINERALS DIVISION PART START =============================*/

      var minerals_division_base_data = {}
      var minerals_division_data_seq = []
      var minerals_division_additional_data = {}

      /* Set MINERALS Division Income Data via Trip MINERALS Division Journies by Loop */
      for (var i = 0; i < mineralDivisionData.length; i++) {
        console.log(mineralDivisionData[i],'mineralDivisionData[i]',i)
        let add_condition = tripAdditionalFreightHaving(mineralDivisionData[i])

        if(add_condition == 'YES'){

          /* Additional Element Forming */
          minerals_division_additional_data.VEHICLE_NO = tripInfo.vehicle_number
          minerals_division_additional_data.TRIPSHEET_NO = tripInfo.tripsheet_info.nlmt_tripsheet_no
          minerals_division_additional_data.DIVISION = 'MINERALS'
          minerals_division_additional_data.DOC_POST = 'ADDITIONAL'
          minerals_division_additional_data.JOURNEY_TYPE = journey_type_finder(mineralDivisionData[i])
          minerals_division_additional_data.DOCUMENT_NO = mineralDivisionData[i].shipment_no
            ? mineralDivisionData[i].shipment_no
            : (mineralDivisionData[i].sto_delivery_no == '' ? mineralDivisionData[i].rake_migo_no : mineralDivisionData[i].sto_delivery_no)

          if (tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id == 3) {
            if (tripInfo.tripsheet_info.purpose == 3) {
              minerals_division_additional_data.HIRE_FRE_VEN_BALANCE = totalTripIncome
            }
          } else {
            minerals_division_additional_data.HIRE_FRE_VEN_BALANCE = 0
          }

          minerals_division_additional_data.POST_DATE = values.income_posting_date
          minerals_division_additional_data.BASE_FREIGHT = 0
          minerals_division_additional_data.HALTING_CHARG = mineralDivisionData[i].income_halting_charges_input
            ? mineralDivisionData[i].income_halting_charges_input
            : mineralDivisionData[i].income_halting_charges
            ? mineralDivisionData[i].income_halting_charges
            : 0
          minerals_division_additional_data.SUBDELIVERY_CHARG = mineralDivisionData[i].income_sub_delivery_charges_input
            ? mineralDivisionData[i].income_sub_delivery_charges_input
            : mineralDivisionData[i].income_sub_delivery_charges
            ? mineralDivisionData[i].income_sub_delivery_charges
            : 0
          minerals_division_additional_data.UNLOADING_CHARG = mineralDivisionData[i].income_unloading_charges_input
            ? mineralDivisionData[i].income_unloading_charges_input
            : mineralDivisionData[i].income_unloading_charges
            ? mineralDivisionData[i].income_unloading_charges
            : 0
          minerals_division_additional_data.WEIGHMENT_CHARG = mineralDivisionData[i].income_weighment_chares_input
            ? mineralDivisionData[i].income_weighment_chares_input
            : mineralDivisionData[i].income_weighment_chares
            ? mineralDivisionData[i].income_weighment_chares
            : 0
          minerals_division_additional_data.LOW_TONAGE_CHARG = mineralDivisionData[i].income_low_tonage_charges_input
            ? mineralDivisionData[i].income_low_tonage_charges_input
            : mineralDivisionData[i].income_low_tonage_charges
            ? mineralDivisionData[i].income_low_tonage_charges
            : 0
          minerals_division_additional_data.TOLL_CHARG = mineralDivisionData[i].income_toll_charges_input
            ? mineralDivisionData[i].income_toll_charges_input
            : mineralDivisionData[i].income_toll_charges
            ? mineralDivisionData[i].income_toll_charges
            : 0
          minerals_division_additional_data.OTHER_FREIGHT = mineralDivisionData[i].income_others_charges_input
            ? mineralDivisionData[i].income_others_charges_input
            : mineralDivisionData[i].income_others_charges
            ? mineralDivisionData[i].income_others_charges
            : 0
          minerals_division_additional_data.TOT_FRE_INC = total_journey_income(mineralDivisionData[i],2)

        }

        /* Base Element Forming */
        minerals_division_base_data.VEHICLE_NO = tripInfo.vehicle_number
        minerals_division_base_data.TRIPSHEET_NO = tripInfo.tripsheet_info.nlmt_tripsheet_no
        minerals_division_base_data.DIVISION = 'MINERALS'
        minerals_division_base_data.DOC_POST = 'BASE'
        minerals_division_base_data.JOURNEY_TYPE = journey_type_finder(mineralDivisionData[i])
        minerals_division_base_data.DOCUMENT_NO = mineralDivisionData[i].shipment_no
          ? mineralDivisionData[i].shipment_no
          : (mineralDivisionData[i].sto_delivery_no == '' ? mineralDivisionData[i].rake_migo_no : mineralDivisionData[i].sto_delivery_no)

        if (tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id == 3) {
          if (tripInfo.tripsheet_info.purpose == 3) {
            minerals_division_base_data.HIRE_FRE_VEN_BALANCE = totalTripIncome
          }
        } else {
          minerals_division_base_data.HIRE_FRE_VEN_BALANCE = 0
        }

        minerals_division_base_data.POST_DATE = values.income_posting_date
        minerals_division_base_data.BASE_FREIGHT = Number(mineralDivisionData[i].income_base_charges_input) > 0
          ? mineralDivisionData[i].income_base_charges_input
          : mineralDivisionData[i].shipment_freight_amount
          ? mineralDivisionData[i].shipment_freight_amount
          : mineralDivisionData[i].freight_amount
          ? mineralDivisionData[i].freight_amount
          : 0
        minerals_division_base_data.HALTING_CHARG = 0
        minerals_division_base_data.SUBDELIVERY_CHARG = 0
        minerals_division_base_data.UNLOADING_CHARG = 0
        minerals_division_base_data.WEIGHMENT_CHARG = 0
        minerals_division_base_data.LOW_TONAGE_CHARG = 0
        minerals_division_base_data.TOLL_CHARG = 0
        minerals_division_base_data.OTHER_FREIGHT = 0
        minerals_division_base_data.TOT_FRE_INC = total_journey_income(mineralDivisionData[i],1)

        if(add_condition == 'YES'){
          having_div_array[4].additional = 1
          minerals_division_data_seq.push(minerals_division_base_data)
          minerals_division_data_seq.push(minerals_division_additional_data)
        } else {
          minerals_division_data_seq.push(minerals_division_base_data)
        }
        having_div_array[4].base = 1

        minerals_division_base_data = {}
        minerals_division_additional_data = {}
      }

      /*============================= MINERALS DIVISION PART END =============================*/

      /*============================= DETERGENT DIVISION PART START =============================*/

      var detergent_division_base_data = {}
      var detergent_division_data_seq = []
      var detergent_division_additional_data = {}

      /* Set DETERGENTS Division Income Data via Trip DETERGENTS Division Journies by Loop */
      for (var i = 0; i < detergentDivisionData.length; i++) {
        console.log(detergentDivisionData[i],'detergentDivisionData[i]',i)
        let add_condition = tripAdditionalFreightHaving(detergentDivisionData[i])

        if(add_condition == 'YES'){

          /* Additional Element Forming */
          detergent_division_additional_data.VEHICLE_NO = tripInfo.vehicle_number
          detergent_division_additional_data.TRIPSHEET_NO = tripInfo.tripsheet_info.nlmt_tripsheet_no
          detergent_division_additional_data.DIVISION = 'DETERGENTS'
          detergent_division_additional_data.DOC_POST = 'ADDITIONAL'
          detergent_division_additional_data.JOURNEY_TYPE = journey_type_finder(detergentDivisionData[i])
          detergent_division_additional_data.DOCUMENT_NO = detergentDivisionData[i].shipment_no
            ? detergentDivisionData[i].shipment_no
            : (detergentDivisionData[i].sto_delivery_no == '' ? detergentDivisionData[i].rake_migo_no : detergentDivisionData[i].sto_delivery_no)

          if (tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id == 3) {
            if (tripInfo.tripsheet_info.purpose == 3) {
              detergent_division_additional_data.HIRE_FRE_VEN_BALANCE = totalTripIncome
            }
          } else {
            detergent_division_additional_data.HIRE_FRE_VEN_BALANCE = 0
          }

          detergent_division_additional_data.POST_DATE = values.income_posting_date
          detergent_division_additional_data.BASE_FREIGHT = 0
          detergent_division_additional_data.HALTING_CHARG = detergentDivisionData[i].income_halting_charges_input
            ? detergentDivisionData[i].income_halting_charges_input
            : detergentDivisionData[i].income_halting_charges
            ? detergentDivisionData[i].income_halting_charges
            : 0
          detergent_division_additional_data.SUBDELIVERY_CHARG = detergentDivisionData[i].income_sub_delivery_charges_input
            ? detergentDivisionData[i].income_sub_delivery_charges_input
            : detergentDivisionData[i].income_sub_delivery_charges
            ? detergentDivisionData[i].income_sub_delivery_charges
            : 0
          detergent_division_additional_data.UNLOADING_CHARG = detergentDivisionData[i].income_unloading_charges_input
            ? detergentDivisionData[i].income_unloading_charges_input
            : detergentDivisionData[i].income_unloading_charges
            ? detergentDivisionData[i].income_unloading_charges
            : 0
          detergent_division_additional_data.WEIGHMENT_CHARG = detergentDivisionData[i].income_weighment_chares_input
            ? detergentDivisionData[i].income_weighment_chares_input
            : detergentDivisionData[i].income_weighment_chares
            ? detergentDivisionData[i].income_weighment_chares
            : 0
          detergent_division_additional_data.LOW_TONAGE_CHARG = detergentDivisionData[i].income_low_tonage_charges_input
            ? detergentDivisionData[i].income_low_tonage_charges_input
            : detergentDivisionData[i].income_low_tonage_charges
            ? detergentDivisionData[i].income_low_tonage_charges
            : 0
          detergent_division_additional_data.TOLL_CHARG = detergentDivisionData[i].income_toll_charges_input
            ? detergentDivisionData[i].income_toll_charges_input
            : detergentDivisionData[i].income_toll_charges
            ? detergentDivisionData[i].income_toll_charges
            : 0
          detergent_division_additional_data.OTHER_FREIGHT = detergentDivisionData[i].income_others_charges_input
            ? detergentDivisionData[i].income_others_charges_input
            : detergentDivisionData[i].income_others_charges
            ? detergentDivisionData[i].income_others_charges
            : 0
          detergent_division_additional_data.TOT_FRE_INC = total_journey_income(detergentDivisionData[i],2)

        }

        /* Base Element Forming */
        detergent_division_base_data.VEHICLE_NO = tripInfo.vehicle_number
        detergent_division_base_data.TRIPSHEET_NO = tripInfo.tripsheet_info.nlmt_tripsheet_no
        detergent_division_base_data.DIVISION = 'DETERGENTS'
        detergent_division_base_data.DOC_POST = 'BASE'
        detergent_division_base_data.JOURNEY_TYPE = journey_type_finder(detergentDivisionData[i])
        detergent_division_base_data.DOCUMENT_NO = detergentDivisionData[i].shipment_no
          ? detergentDivisionData[i].shipment_no
          : (detergentDivisionData[i].sto_delivery_no == '' ? detergentDivisionData[i].rake_migo_no : detergentDivisionData[i].sto_delivery_no)

        if (tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id == 3) {
          if (tripInfo.tripsheet_info.purpose == 3) {
            detergent_division_base_data.HIRE_FRE_VEN_BALANCE = totalTripIncome
          }
        } else {
          detergent_division_base_data.HIRE_FRE_VEN_BALANCE = 0
        }

        detergent_division_base_data.POST_DATE = values.income_posting_date
        detergent_division_base_data.BASE_FREIGHT = Number(detergentDivisionData[i].income_base_charges_input) > 0
          ? detergentDivisionData[i].income_base_charges_input
          : detergentDivisionData[i].shipment_freight_amount
          ? detergentDivisionData[i].shipment_freight_amount
          : detergentDivisionData[i].freight_amount
          ? detergentDivisionData[i].freight_amount
          : 0
        detergent_division_base_data.HALTING_CHARG = 0
        detergent_division_base_data.SUBDELIVERY_CHARG = 0
        detergent_division_base_data.UNLOADING_CHARG = 0
        detergent_division_base_data.WEIGHMENT_CHARG = 0
        detergent_division_base_data.LOW_TONAGE_CHARG = 0
        detergent_division_base_data.TOLL_CHARG = 0
        detergent_division_base_data.OTHER_FREIGHT = 0
        detergent_division_base_data.TOT_FRE_INC = total_journey_income(detergentDivisionData[i],1)


        if(add_condition == 'YES'){
          having_div_array[5].additional = 1
          detergent_division_data_seq.push(detergent_division_base_data)
          detergent_division_data_seq.push(detergent_division_additional_data)
        } else {
          detergent_division_data_seq.push(detergent_division_base_data)
        }
        having_div_array[5].base = 1

        detergent_division_base_data = {}
        detergent_division_additional_data = {}
      }

      /*============================= DETERGENT DIVISION PART END =============================*/

      /*============================= SERVICE DIVISION PART START =============================*/

      var service_division_base_data = {}
      var service_division_data_seq = []
      var service_division_additional_data = {}

      /* Set Foods Division Income Data via Trip Foods Division Journies by Loop */
      for (var i = 0; i < serviceDivisionData.length; i++) {
        console.log(serviceDivisionData[i],'serviceDivisionData[i]',i)
        let add_condition = tripAdditionalFreightHaving(serviceDivisionData[i])

        if(add_condition == 'YES'){

          /* Additional Element Forming */
          service_division_additional_data.VEHICLE_NO = tripInfo.vehicle_number
          service_division_additional_data.TRIPSHEET_NO = tripInfo.tripsheet_info.nlmt_tripsheet_no
          service_division_additional_data.DIVISION = 'SERVICE'
          service_division_additional_data.DOC_POST = 'ADDITIONAL'
          service_division_additional_data.JOURNEY_TYPE = journey_type_finder(serviceDivisionData[i])
          service_division_additional_data.DOCUMENT_NO = serviceDivisionData[i].shipment_no
            ? serviceDivisionData[i].shipment_no
            : (serviceDivisionData[i].sto_delivery_no == '' ? serviceDivisionData[i].rake_migo_no : serviceDivisionData[i].sto_delivery_no)

          if (tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id == 3) {
            if (tripInfo.tripsheet_info.purpose == 3) {
              service_division_additional_data.HIRE_FRE_VEN_BALANCE = totalTripIncome
            }
          } else {
            service_division_additional_data.HIRE_FRE_VEN_BALANCE = 0
          }

          service_division_additional_data.POST_DATE = values.income_posting_date
          service_division_additional_data.BASE_FREIGHT = 0
          service_division_additional_data.HALTING_CHARG = serviceDivisionData[i].income_halting_charges_input
            ? serviceDivisionData[i].income_halting_charges_input
            : serviceDivisionData[i].income_halting_charges
            ? serviceDivisionData[i].income_halting_charges
            : 0
          service_division_additional_data.SUBDELIVERY_CHARG = serviceDivisionData[i].income_sub_delivery_charges_input
            ? serviceDivisionData[i].income_sub_delivery_charges_input
            : serviceDivisionData[i].income_sub_delivery_charges
            ? serviceDivisionData[i].income_sub_delivery_charges
            : 0
          service_division_additional_data.UNLOADING_CHARG = serviceDivisionData[i].income_unloading_charges_input
            ? serviceDivisionData[i].income_unloading_charges_input
            : serviceDivisionData[i].income_unloading_charges
            ? serviceDivisionData[i].income_unloading_charges
            : 0
          service_division_additional_data.WEIGHMENT_CHARG = serviceDivisionData[i].income_weighment_chares_input
            ? serviceDivisionData[i].income_weighment_chares_input
            : serviceDivisionData[i].income_weighment_chares
            ? serviceDivisionData[i].income_weighment_chares
            : 0
          service_division_additional_data.LOW_TONAGE_CHARG = serviceDivisionData[i].income_low_tonage_charges_input
            ? serviceDivisionData[i].income_low_tonage_charges_input
            : serviceDivisionData[i].income_low_tonage_charges
            ? serviceDivisionData[i].income_low_tonage_charges
            : 0
          service_division_additional_data.TOLL_CHARG = serviceDivisionData[i].income_toll_charges_input
            ? serviceDivisionData[i].income_toll_charges_input
            : serviceDivisionData[i].income_toll_charges
            ? serviceDivisionData[i].income_toll_charges
            : 0
          service_division_additional_data.OTHER_FREIGHT = serviceDivisionData[i].income_others_charges_input
            ? serviceDivisionData[i].income_others_charges_input
            : serviceDivisionData[i].income_others_charges
            ? serviceDivisionData[i].income_others_charges
            : 0
          service_division_additional_data.TOT_FRE_INC = total_journey_income(serviceDivisionData[i],2)

        }

        /* Base Element Forming */
        service_division_base_data.VEHICLE_NO = tripInfo.vehicle_number
        service_division_base_data.TRIPSHEET_NO = tripInfo.tripsheet_info.nlmt_tripsheet_no
        service_division_base_data.DIVISION = 'SERVICE'
        service_division_base_data.DOC_POST = 'BASE'
        service_division_base_data.JOURNEY_TYPE = journey_type_finder(serviceDivisionData[i])
        service_division_base_data.DOCUMENT_NO = serviceDivisionData[i].shipment_no
          ? serviceDivisionData[i].shipment_no
          : (serviceDivisionData[i].sto_delivery_no == '' ? serviceDivisionData[i].rake_migo_no : serviceDivisionData[i].sto_delivery_no)

        if (tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id == 3) {
          if (tripInfo.tripsheet_info.purpose == 3) {
            service_division_base_data.HIRE_FRE_VEN_BALANCE = totalTripIncome
          }
        } else {
          service_division_base_data.HIRE_FRE_VEN_BALANCE = 0
        }

        service_division_base_data.POST_DATE = values.income_posting_date
        service_division_base_data.BASE_FREIGHT = Number(serviceDivisionData[i].income_base_charges_input) > 0
          ? serviceDivisionData[i].income_base_charges_input
          : serviceDivisionData[i].shipment_freight_amount
          ? serviceDivisionData[i].shipment_freight_amount
          : serviceDivisionData[i].freight_amount
          ? serviceDivisionData[i].freight_amount
          : 0
        service_division_base_data.HALTING_CHARG = 0
        service_division_base_data.SUBDELIVERY_CHARG = 0
        service_division_base_data.UNLOADING_CHARG = 0
        service_division_base_data.WEIGHMENT_CHARG = 0
        service_division_base_data.LOW_TONAGE_CHARG = 0
        service_division_base_data.TOLL_CHARG = 0
        service_division_base_data.OTHER_FREIGHT = 0
        service_division_base_data.TOT_FRE_INC = total_journey_income(serviceDivisionData[i],1)

        if(add_condition == 'YES'){
          having_div_array[6].additional = 1
          service_division_data_seq.push(service_division_base_data)
          service_division_data_seq.push(service_division_additional_data)
        } else {
          service_division_data_seq.push(service_division_base_data)
        }
        having_div_array[6].base = 1

        service_division_base_data = {}
        service_division_additional_data = {}
      }

      /*============================= SERVICE DIVISION PART END =============================*/

      console.log(foods_division_data_seq, 'foods_division_data_seq')
      console.log(service_division_data_seq, 'service_division_data_seq')
      console.log(detergent_division_data_seq, 'detergent_division_data_seq')
      console.log(minerals_division_data_seq, 'minerals_division_data_seq')
      console.log(ifoods_division_data_seq, 'ifoods_division_data_seq')
      console.log(mmd_division_data_seq, 'mmd_division_data_seq')
      console.log(consumer_division_data_seq, 'consumer_division_data_seq')
      console.log(rj_customer_data_seq, 'rj_customer_data_seq')

      let sap_income_json_array = []
      let div_count = 0
      if(foods_division_data_seq.length > 0){
        div_count = div_count+1
        foods_division_data_seq.map((vb,kb)=>{
          sap_income_json_array.push(vb)
        })
      }
      if(consumer_division_data_seq.length > 0){
        div_count = div_count+1
        consumer_division_data_seq.map((vb,kb)=>{
          sap_income_json_array.push(vb)
          })
      }
      if(mmd_division_data_seq.length > 0){
        div_count = div_count+1
        mmd_division_data_seq.map((vb,kb)=>{
          sap_income_json_array.push(vb)
        })
      }
      if(ifoods_division_data_seq.length > 0){
        div_count = div_count+1
        ifoods_division_data_seq.map((vb,kb)=>{
          sap_income_json_array.push(vb)
        })
      }
      if(minerals_division_data_seq.length > 0){
        div_count = div_count+1
        minerals_division_data_seq.map((vb,kb)=>{
          sap_income_json_array.push(vb)
        })
      }
      if(detergent_division_data_seq.length > 0){
        div_count = div_count+1
        detergent_division_data_seq.map((vb,kb)=>{
          sap_income_json_array.push(vb)
        })
      }
      if(service_division_data_seq.length > 0){
        div_count = div_count+1
        service_division_data_seq.map((vb,kb)=>{
          sap_income_json_array.push(vb)
        })
      }

      console.log(sap_income_json_array, 'sap_income_json_array')
      console.log(having_div_array, 'having_div_array')
      console.log(div_count, 'div_count')

      let sap_response_array_count = 0
      having_div_array.map((vv,kk)=>{
        if(vv.base == 1){
          sap_response_array_count++
        }
        if(vv.additional == 1){
          sap_response_array_count++
        }
      })
      console.log(sap_response_array_count, 'sap_response_array_count')

      let updated_trip_journey_available = 0

      if(rjsoInfo.length > 0){
        updated_trip_journey_available = 1
      } else {
        updated_trip_journey_available = 2
      }

      /*** Type 1 :  All Income Claim Own and Contract Vehicles (With RJ) Start ***/
      /* ======================================================================================= */
        if (updated_trip_journey_available == '1') {
          if (rj_customer_data_seq.length > 0) {
            rj_customer_data_seq.map((rj_customer_data, rj_customer_index) => {

              let citrus = rj_customer_data_seq.slice(rj_customer_index, rj_customer_index + 1)
              console.log(citrus, 'citrus')
              if(rj_customer_data.InvoiceNo == 0){
                delete citrus[0].InvoiceNo
                console.log(citrus, 'updated citrus')
                NlmtTripSheetClosureSapService.rjCustomerIncomePost(citrus).then((res_rji) => {
                  console.log(res_rji)
                  let sap_rj_division_income_document_no = res_rji.data.INVOICE_NO
                  let sap_rj_division_income_status = res_rji.data.STATUS
                  let sap_rj_division_income_tripsheet_no = res_rji.data.TRIPSHEET_NO
                  let sap_rj_income_so_no = res_rji.data.SALEORDER_NO
                  if (
                      sap_rj_division_income_document_no != '' &&
                      sap_rj_division_income_status == '1' &&
                      sap_rj_income_so_no != '' &&
                      sap_rj_division_income_tripsheet_no == tripInfo.tripsheet_info.nlmt_tripsheet_no
                  ) {
                    toast.success('RJ-' + rj_customer_index + ' Income Genereated..!')

                    /* RJ Income DB Update Start */
                    let formData1 = trip_settlement_db_final_update(
                      sap_rj_division_income_document_no,
                      'RJSO',
                      sap_rj_division_income_tripsheet_no,
                      'rjso_trip',
                      sap_rj_income_so_no,
                    )
                    NlmtTripSheetClosureService.updateSettlementClosureAcception(id, formData1)
                    .then((res) => {
                      if (res.status == 200) {
                      toast.success(
                          'Settlement Closure: RJ Customer Income For ' +
                          rj_customer_data.vbeln +
                          'Income Submitted!'
                      )
                      } else {
                      toast.warning('Something Went Wrong !')
                      return false
                      }
                    })
                    .catch((error) => {
                      // setFetch(true)
                      var object = error.response.data.errors
                      var output = ''
                      for (var property in object) {
                      output += '*' + object[property] + '\n'
                      }
                      setError(output)
                      setErrorModal(true)
                      return false
                    })
                    /* RJ Income DB Update End */
                  } else {
                    toast.warning(
                    'RJ Customer Income For ' +
                        rj_customer_data.vbeln +
                        'Cannot be Posted From SAP.. Kindly Contact Admin!'
                    )
                  }
                })
              }
              let next_index = rj_customer_index + 1
              if (next_index == rj_customer_data_seq.length) {
                NlmtTripSheetClosureSapService.tsDivisionIncomePost(sap_income_json_array).then((res_fi) => {
                  console.log(res_fi,'tsDivisionIncomePost')
                  let sap_response = res_fi.data
                  setSapResponse(sap_response)
                  console.log(sap_response,'sap_response')
                  if(sap_response.length == sap_response_array_count && res_fi.status == 200){

                    formData = latest_trip_settlement_db_final_update(sap_response,div_count)
                    NlmtTripSheetClosureService.settlementClosureUpdation(id, formData).then((res) => {
                      console.log(res,'res')
                      setFetch(true)
                      if (res.status == 201){
                        Swal.fire({
                          title: `Settlement Closure Process ${res.data.be_status == 0 ? 'Submitted Successfully' : 'Partially Completed'}!`,
                          icon: "success",
                          width: "55em",
                          html: `<table id="table" border=1>
                                  <thead>
                                    <tr>
                                      <th scope="col">S.No</th>
                                      <th scope="col">Division</th>
                                      <th scope="col">Freight Type</th>
                                      <th scope="col">SAP Doc. No</th>
                                      <th scope="col">Status</th>
                                      <th scope="col">SAP Message</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    ${customElement(sap_response)}
                                  </tbody>
                                </table>`,
                          confirmButtonText: "OK",
                        }).then(function () {
                          navigation('/NlmtTSIncomeClosureHome')
                        });
                      } else {
                        toast.warning('Something Went Wrong !')
                      }
                    })
                    .catch((error) => {
                      console.log(error,'tsDivisionIncomePost-error')
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

                  } else {
                    setFetch(true)
                    Swal.fire({
                      title: 'Settlement Closure Submission Failed in SAP.. Kindly Contact Admin!',
                      icon: "warning",
                      confirmButtonText: "OK",
                    }).then(function () {

                    })
                  }
                })
              }
            })
          }
        }
      /* ======================================================================================= */
      /*** Type 1 :  All Income Claim for Hire Vehicles (OR) & Own and Contract Vehicles (Without RJ) Start ***/

      /*** Type 2 :  All Income Claim for Hire Vehicles (OR) & Own and Contract Vehicles (Without RJ) Start ***/
      /* ======================================================================================= */
        else if (updated_trip_journey_available == '2') {
          if (sap_income_json_array.length > 0) {
            NlmtTripSheetClosureSapService.tsDivisionIncomePost(sap_income_json_array).then((res_fi) => {
              console.log(res_fi,'tsDivisionIncomePost')
              let sap_response = res_fi.data
              setSapResponse(sap_response)
              console.log(sap_response,'sap_response')
              if(sap_response.length == sap_response_array_count && res_fi.status == 200){

                formData = latest_trip_settlement_db_final_update(sap_response,div_count)
                NlmtTripSheetClosureService.settlementClosureUpdation(id, formData).then((res) => {
                  console.log(res,'res')
                  setFetch(true)
                  if (res.status == 201){
                    Swal.fire({
                      title: `Settlement Closure Process ${res.data.be_status == 0 ? 'Submitted Successfully' : 'Partially Completed'}!`,
                      icon: "success",
                      width: "55em",
                      html: `<table id="table" border=1>
                              <thead>
                                <tr>
                                  <th scope="col">S.No</th>
                                  <th scope="col">Division</th>
                                  <th scope="col">Freight Type</th>
                                  <th scope="col">SAP Doc. No</th>
                                  <th scope="col">Status</th>
                                  <th scope="col">SAP Message</th>
                                </tr>
                              </thead>
                              <tbody>
                                ${customElement(sap_response)}
                              </tbody>
                            </table>`,
                      confirmButtonText: "OK",
                    }).then(function () {
                      navigation('/NlmtTSIncomeClosureHome')
                    });
                  } else {
                    toast.warning('Something Went Wrong !')
                  }
                })
                .catch((error) => {
                  console.log(error,'tsDivisionIncomePost-error')
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

              } else {
                setFetch(true)
                Swal.fire({
                  title: 'Settlement Closure Submission Failed in SAP.. Kindly Contact Admin!',
                  icon: "warning",
                  confirmButtonText: "OK",
                }).then(function () {

                })
              }
            })
          }
        }
      /* ======================================================================================= */
      /*** Type 2 :  All Income Claim for Hire Vehicles (OR) & Own and Contract Vehicles (Without RJ) End ***/

  }

  /* =========== Others Tripsheet Reworks Part Start ask1=========== */

  const [divisionData, setDivisionData] = useState([])
  const [departmentData, setDepartmentData] = useState([])

  const [vehicleVariety, setVehicleVariety] = useState([])

  const [vrProductdata, setVrProductdata] = useState([])
  const [vrPurposedata, setVrPurposedata] = useState([])
  const [vrData, setVrData] = useState([])
  const [gstTaxTermsData, setGstTaxTermsData] = useState([])
  const [tdsTaxTermsData, setTdsTaxTermsData] = useState([])
  const [sapHsnData, setSapHsnData] = useState([])
  const [dvData, setDvData] = useState([])

  useEffect(() => {

    /* section for getting GST Tax Terms Master List For GST Tax Code Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(20).then((response) => {
      console.log(response.data.data,'setGstTaxTermsData')
      setGstTaxTermsData(response.data.data)
    })

    /* section for getting TDS Tax Terms Master List For TDS Tax Code Display from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      console.log(response.data.data,'setTdsTaxTermsData')
      setTdsTaxTermsData(response.data.data)
    })

    /* section for getting Sap Hsn Data from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(27).then((response) => {
      console.log(response.data.data,'DefinitionsListApi-setSapHsnData')
      setSapHsnData(response.data.data)
    })

    DieselVendorMasterService.getDieselVendors().then((response) => {
      let viewData = response.data.data
      console.log(viewData,'getDieselVendors')
      setDvData(viewData)
    })
  }, [])

  const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 5
        }}
    />
  )

  const othersDivisionFinder = (vrId) => {
    let div = 0
    // console.log(vrId,'vrId-othersDivisionFinder')
    vehicleRequestsData.map((vh,kh)=>{
      // console.log(vh,'vrId-othersDivisionFinder',kh)
      if(vh.vr_id == vrId){
        div = vh.vr_division
      }
    })
    // console.log(div,'div-othersDivisionFinder')
    // console.log(othersDivisionArray[div],'othersDivisionArray[div]-othersDivisionFinder')
    return othersDivisionArray[div]
  }

  const [sapResponse, setSapResponse] = useState([]);

  /* Find Additional Freight Having or not */
  const tripAdditionalFreightHaving = (trip_data) => {
    console.log(trip_data,'tripAdditionalFreightHavingData')
    let ad_having = 'YES'
    let HALTING_CHARG = trip_data.income_halting_charges_input
      ? trip_data.income_halting_charges_input
      : trip_data.income_halting_charges
      ? trip_data.income_halting_charges
      : 0

    let SUBDELIVERY_CHARG = trip_data.income_sub_delivery_charges_input
      ? trip_data.income_sub_delivery_charges_input
      : trip_data.income_sub_delivery_charges
      ? trip_data.income_sub_delivery_charges
      : 0

    let UNLOADING_CHARG = trip_data.income_unloading_charges_input
      ? trip_data.income_unloading_charges_input
      : trip_data.income_unloading_charges
      ? trip_data.income_unloading_charges
      : 0

    let WEIGHMENT_CHARG = trip_data.income_weighment_chares_input
      ? trip_data.income_weighment_chares_input
      : trip_data.income_weighment_chares
      ? trip_data.income_weighment_chares
      : 0

    let LOW_TONAGE_CHARG = trip_data.income_low_tonage_charges_input
      ? trip_data.income_low_tonage_charges_input
      : trip_data.income_low_tonage_charges
      ? trip_data.income_low_tonage_charges
      : 0

    let TOLL_CHARG = trip_data.income_toll_charges_input
      ? trip_data.income_toll_charges_input
      : trip_data.income_toll_charges
      ? trip_data.income_toll_charges
      : 0

    let OTHER_FREIGHT = trip_data.income_others_charges_input
      ? trip_data.income_others_charges_input
      : trip_data.income_others_charges
      ? trip_data.income_others_charges
      : 0

    console.log(HALTING_CHARG,'HALTING_CHARG')
    console.log(SUBDELIVERY_CHARG,'SUBDELIVERY_CHARG')
    console.log(UNLOADING_CHARG,'UNLOADING_CHARG')
    console.log(WEIGHMENT_CHARG,'WEIGHMENT_CHARG')
    console.log(LOW_TONAGE_CHARG,'LOW_TONAGE_CHARG')
    console.log(OTHER_FREIGHT,'OTHER_FREIGHT')
    console.log(TOLL_CHARG,'TOLL_CHARG')

    if(HALTING_CHARG == 0 && SUBDELIVERY_CHARG == 0 && UNLOADING_CHARG == 0 && WEIGHMENT_CHARG == 0 && LOW_TONAGE_CHARG == 0 && TOLL_CHARG == 0 && OTHER_FREIGHT == 0){
      ad_having = 'NO'
    }

    return ad_having
  }

  const othersDivisionArray = ['','FOODS','FOODS','DETERGENTS','MINERALS','LOGISTICS','CONSUMER','IFOODS','SERVICE']

  /* ===================== Others STO Table Income Capture Part Start ===================== */

  const changeOthersStoTableItemForIncome = (event, child_property_name, parent_index) => {
    let getData = event.target.value
    console.log(getData, 'getData')

    getData = event.target.value.replace(/\D/g, '')

    const others_sto_parent_income_info = JSON.parse(JSON.stringify(tripOthersStoData))

    console.log(others_sto_parent_income_info[parent_index])
    others_sto_parent_income_info[parent_index][`${child_property_name}_input`] = getData

    others_sto_parent_income_info[parent_index][`total_freight`] = total_trip_freight(
      others_sto_parent_income_info[parent_index],
      'others_sto'
    )

    if (child_property_name !== 'defect_type') {
      others_sto_parent_income_info[parent_index][`${child_property_name}_validated`] = !!getData
    }

    var ant_sto = tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id == 3 ? document.getElementById(`trip_others_sto_freight_${parent_index}`) : document.getElementById(`trip_others_own_sto_freight_${parent_index}`)

    ant_sto.value = others_sto_parent_income_info[parent_index][`total_freight`]

    console.log(ant_sto, 'ant_sto')

    console.log(others_sto_parent_income_info)

    setTripOthersStoData(others_sto_parent_income_info)
  }

  const othersStoDataUpdateforIncome = (original, input) => {
    // return input === undefined ? original : input
    return input === undefined ? original : input
  }

  /* ===================== Others STO Table Income Capture Part End ===================== */

  const getHSNTypeDesc = (hsn) => {
    let hsnDec = ''
    let hsncode = ''
    sapHsnData.map((dl,kl)=>{
      if(hsn == dl.definition_list_code){
        hsnDec = `${dl.definition_list_name}`
        hsncode = dl.definition_list_code
      }
    })
    values.HSNtax = hsncode
    return hsnDec
 }

 const gstTaxCodeName = (code) => {
  let gst_tax_code_name = '-'

  gstTaxTermsData.map((val, key) => {
    if (val.definition_list_code == code) {
      gst_tax_code_name = val.definition_list_name
    }
  })

  console.log(gst_tax_code_name,'gst_tax_code_name')

  return gst_tax_code_name
}

 const tdsTaxCodeName = (code) => {
  let tds_tax_code_name = '-'

  tdsTaxTermsData.map((val, key) => {
    if (val.definition_list_code == code) {
      tds_tax_code_name = val.definition_list_name
    }
  })

  console.log(tds_tax_code_name,'tds_tax_code_name')

  return tds_tax_code_name
}

  const veh_capacity_finder = (capacity) => {
    let cap = ''
    if(vehicleCapacity.length > 0){
      vehicleCapacity.map((vv,kk)=>{
        if(capacity == vv.id){
          cap = vv.capacity
        }
      })
    }
    return cap
  }

  const veh_body_finder = (body) => {
    let bod = ''
    if(vehicleBody.length > 0){
      vehicleBody.map((vv,kk)=>{
        if(body == vv.id){
          bod = vv.body_type
        }
      })
    }
    return bod
  }

  const div_finder = (division) => {
    let div = ''
    if(divisionData.length > 0){
      divisionData.map((vv,kk)=>{
        if(division == vv.id){
          div = vv.division
        }
      })
    }
    return div
  }

  const div_finder_by_vr_id  = (vrId) => {
    let vr_data = []
    vrData.map((vk,lk)=>{
      if(vrId == vk.vr_id){
        vr_data.push(vk)
      }
    })
    console.log('vrId',vrId)
    console.log('vr_data',vr_data)
    let div = '-'
    if(vr_data && vr_data.length > 0){
      if(divisionData.length > 0){
        divisionData.map((vv,kk)=>{
          if(vr_data[0].vr_division == vv.id){
            div = vv.division
          }
        })
      }
    }
    return div
  }

  const purp_finder = (purpose) => {
    let purp = ''
    if(vrPurposedata.length > 0){
      vrPurposedata.map((vv1,kk1)=>{
        if(purpose == vv1.definition_list_code){
          purp = vv1.definition_list_name
        }
      })
    }
    return purp
  }

  const dep_finder = (department) => {
    let dep = ''
    if(departmentData.length > 0){
      departmentData.map((vv,kk)=>{
        if(department == vv.id){
          dep = vv.department
        }
      })
    }
    return dep
  }

  const veh_variety_finder = (variety) => {
    let vari = ''
    if(vehicleVariety.length > 0){
      vehicleVariety.map((vv,kk)=>{
        if(variety == vv.id){
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

  const prod_finder = (product) => {
    let dep = ''
    if(vrProductdata.length > 0){
      vrProductdata.map((vv,kk)=>{
        if(product == vv.definition_list_code){
          dep = vv.definition_list_name
        }
      })
    }
    return dep
  }

  useEffect(() => {

    //section for getting vehicle capacity from database
    VehicleCapacityService.getVehicleCapacity().then((res) => {
      setVehicleCapacity(res.data.data)
    })

    // VehicleBodyTypeService.getVehicleBody().then((res) => {
    //   setVehicleBody(res.data.data)
    // })

    /* section for getting VR Lists from database */
    VehicleRequestMasterService.getClosureVehicleRequests().then((res)=>{

      let vrList = res.data.data
      console.log(vrList,'getVehicleRequests')
      let filterData =  vrList.filter(
        (data) => data.vr_tr_no == null
      )
      console.log(filterData,'getVehicleRequests-filterData')
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
      console.log(viewData,'VR Purpose Lists')
      setVrPurposedata(viewData)
    })

    /* section for getting VR Product Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(30).then((response) => {

      let viewData = response.data.data
      console.log(viewData,'VR Product Lists')
      let filter_Data =  viewData.filter(
        (data) => data.definition_list_status == 1
      )
      console.log(filter_Data,'VR Product Lists - filter_Data')
      setVrProductdata(filter_Data)
    })

 }, [])

  useEffect(()=>{

    if(tripInfo && tripInfo.tripsheet_info){
      console.log(tripInfo.tripsheet_info.vehicle_requests,'vehicle_requests')

      let veh_req = tripInfo.tripsheet_info.vehicle_requests // 7,8,9

      if(veh_req != null){

        const formData = new FormData()
        formData.append('vr_string', veh_req)

        ParkingYardGateService.fetchVRList(formData).then((res) => {
          setSmallFetch(true)
          console.log(res,'fetchVRList')
          let vrlistData = res.data.data
          setVehicleRequestsData(vrlistData)

        })

      } else {
        setSmallFetch(true)
      }

    }

  },[tripInfo.tripsheet_info])

  /* =========== Others Tripsheet Reworks Part Start ask2=========== */

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
                            tripInfo && tripInfo.tripsheet_info ? tripInfo.tripsheet_info.nlmt_tripsheet_no : ''
                          }
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>

                        <CFormInput size="sm" id="vNum" value={tripInfo?.vehicle_info?.vehicle_number} readOnly />
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
                        <CFormLabel htmlFor="vType">Vehicle Type</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="vType"
                          value={tripInfo.vehicle_info ? tripInfo.vehicle_info.vehicle_type_id : ''}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="dName">Driver Name</CFormLabel>

                        <CFormInput size="sm" id="dName" value={tripInfo.driver_name} readOnly />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="dMob">Driver Cell Number</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="dMob"
                          value={tripInfo.driver_contact_number}
                          readOnly
                        />
                      </CCol>
                      {tripInfo && tripInfo.tripsheet_info && tripInfo.tripsheet_info.purpose != 4 && (
                        <>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vtf">Vehicle Taken For</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="vtf"
                              value={
                                tripInfo.tripsheet_info
                                  ? tripInfo.tripsheet_info.purpose == 1
                                    ? 'FG-SALES'
                                    : tripInfo.tripsheet_info.purpose == 2
                                    ? 'FG-STO'
                                    : tripInfo.tripsheet_info.purpose == 3
                                    ? 'RM-STO'
                                    : tripInfo.tripsheet_info.purpose == 4
                                    ? 'OTHERS'
                                    : ''
                                  : ''
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="to_division">Division Type</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="to_division"
                              value={
                                tripInfo.tripsheet_info
                                  ? tripInfo.tripsheet_info.to_divison == 3
                                    ? 'NLMT'
                                    :  'Foods'
                                  : ''
                              }
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
                              ? tripInfo.tripsheet_info.trip_advance_eligiblity == 1
                                ? 'YES'
                                : 'NO'
                              : ''
                          }
                          readOnly
                        />
                      </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="gateInDateTime">Gate-In Date & Time</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="gateInDateTime"
                          value={tripInfo.gate_in_date_time_string}
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
                              tripInfo.vehicle_inspection_trip
                                ? tripInfo.vehicle_inspection_trip.inspection_time_string
                                : 'No Inspection'
                            }
                            readOnly
                          />
                        </CCol>
                      )}
                      {tripInfo && tripInfo.tripsheet_info && tripInfo.tripsheet_info.purpose < 3 && (
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="verifyDate">Doc. Verification Date & Time</CFormLabel>

                          <CFormInput
                            size="sm"
                            id="verifyDate"
                            value={
                              tripInfo.vehicle_document
                                ? tripInfo.vehicle_document.doc_verify_time_string
                                : ''
                            }
                            readOnly
                          />
                        </CCol>
                      )}
                      {tripInfo && tripInfo.tripsheet_info && tripInfo.tripsheet_info.purpose != 4 && (
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="gateoutDate">Gate Out Date & Time</CFormLabel>

                          <CFormInput
                            size="sm"
                            id="gateoutDate"
                            value={tripInfo.gate_out_date_time_string}
                            readOnly
                          />
                        </CCol>
                      )}
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="shedName">Shed Name</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="shedName"
                          value={tripInfo.vendor_info ? tripInfo.vendor_info.shed_info.shed_name : ''}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="shedOwnerName">Shed Owner Name</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="shedOwnerName"
                          value={
                            tripInfo.vendor_info ? tripInfo.vendor_info.shed_info.shed_owner_name : ''
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
                          value={tripInfo.vendor_info ? tripInfo.vendor_info.owner_number : ''}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="vendorPanNo">Vendor PAN Number</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="vendorPanNo"
                          value={tripInfo.vendor_info ? tripInfo.vendor_info.pan_card_number : ''}
                          readOnly
                        />
                      </CCol>

                      {tripInfo && tripInfo.tripsheet_info && (
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="diffmil">Trip Purpose</CFormLabel>

                          <CFormInput size="sm" id="diffmil" value={tripPurposeFinder(tripInfo.tripsheet_info.purpose)} readOnly />
                        </CCol>
                      )}
                    </CRow>
                    {tripInfo && tripInfo.tripsheet_info && tripInfo.tripsheet_info.purpose == 4 && (
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
                        {smallFetch && vehicleRequestsData.map((currentVrData,kk)=>{
                          return (
                            <>
                              <CRow>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="tNum">{kk+1} ) VR No</CFormLabel>
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
                                   // value={div_finder(currentVrData.vr_division)}
                                   value='NLMT'
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
                                  <CFormLabel htmlFor="tNum">Purpose</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="tNum"
                                    value={(purp_finder(currentVrData.vr_purpose))}
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
                                  <CFormLabel htmlFor="tNum">Vehicle Capacity (TON)</CFormLabel>
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
                                  <CFormLabel htmlFor="tNum">Vehicle Body Type / Variety</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="tNum"
                                    value={`${veh_body_finder(currentVrData.vr_body_id)} / ${veh_variety_finder(currentVrData.vr_variety_id) || '-'}`}
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
                  {/* Hire Vehicle General Info Part End */}

                  {/* Hire Vehicle Over All Info Part Start */}
                  <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 15}>
                    {tripFgsalesData && tripFgsalesData.length > 0 && (
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
                          fgsalesJourneyInfo={tripFgsalesData}
                          title="FG-Sales Information"
                        />
                        <hr />
                      </>
                    )}

                    {tripStoData && tripStoData.length > 0 && (
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
                              STO Information
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        <NlmtRMSTOJourneyInfo rmstoJourneyInfo={tripStoData} title="STO Information" />
                        <hr />
                      </>
                    )}
                    {tripOthersStoData && tripOthersStoData.length > 0 && (
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
                              Others Information
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        <NlmtOthersJourneyInfo tripInfo={tripInfo} othersJourneyInfo={tripOthersStoData} title="Others Information" />
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
                      </>
                    )}
                    <hr />
                    {tripInfo.advance_info && (
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
                              Freight Information
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        <CTable caption="top" hover>
                          <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                            <CTableRow>
                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Load Tonnage in MTS
                              </CTableHeaderCell>
                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Freight Amount
                              </CTableHeaderCell>
                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Low Tonnage Amount
                              </CTableHeaderCell>
                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Total Freight Amount
                              </CTableHeaderCell>
                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Advance in Diesel
                              </CTableHeaderCell>
                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Advance in Bank
                              </CTableHeaderCell>

                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Total Advance
                              </CTableHeaderCell>
                              <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                                Balance
                              </CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>

                          <CTableBody>
                            <CTableRow>
                              {/* Freight : Load Tonnage in MTS Part Start */}
                              {shipmentInfo && shipmentInfo.length > 0 && (
                                <>
                                  {shipmentInfo.map((data, index) => {
                                    return (
                                      <CTableDataCell key={`freight_load_tonnage_data${index}`}>
                                        <CFormInput
                                          size="sm"
                                          id={`freight_qty_${index}`}
                                          maxLength={5}
                                          name={`freight_qty_${index}`}
                                          value={data.shipment_qty}
                                          readOnly
                                        />
                                      </CTableDataCell>
                                    )
                                  })}
                                </>
                              )}

                              {stoTableData && stoTableData.length > 0 && (
                                <>
                                  {stoTableData.map((data, index) => {
                                    return (
                                      <CTableDataCell key={`freight_load_tonnage_data${index}`}>
                                        <CFormInput
                                          size="sm"
                                          maxLength={5}
                                          id={`freight_qty_${index}`}
                                          name={`freight_qty_${index}`}
                                          value={data.sto_delivery_quantity}
                                          readOnly
                                        />
                                      </CTableDataCell>
                                    )
                                  })}
                                </>
                              )}

                              {stoTableDataRMSTO && stoTableDataRMSTO.length > 0 && (
                                <>
                                  {stoTableDataRMSTO.map((data, index) => {
                                    return (
                                      <CTableDataCell key={`freight_load_tonnage_data${index}`}>
                                        <CFormInput
                                          size="sm"
                                          maxLength={5}
                                          id={`freight_qty_${index}`}
                                          name={`freight_qty_${index}`}
                                          value={data.sto_delivery_quantity_rmsto}
                                          readOnly
                                        />
                                      </CTableDataCell>
                                    )
                                  })}
                                </>
                              )}

                              {tripOthersStoData && tripOthersStoData.length > 0 && (
                                <>
                                  {tripOthersStoData.map((data, index) => {
                                    return (
                                      <CTableDataCell key={`freight_load_tonnage_data${index}`}>
                                        <CFormInput
                                          size="sm"
                                          maxLength={5}
                                          id={`freight_qty_${index}`}
                                          name={`freight_qty_${index}`}
                                          value={data.sto_delivery_quantity}
                                          readOnly
                                        />
                                      </CTableDataCell>
                                    )
                                  })}
                                </>
                              )}

                              <CTableDataCell key={`freight_amount_data`}>
                                <CFormInput
                                  size="sm"
                                  id={`freight_amount_data`}
                                  maxLength={5}
                                  name={`freight_amount_data`}
                                  // value={
                                  //   tripInfo.advance_payment_info
                                  //     ? tripInfo.advance_payment_info.actual_freight
                                  //     : 0
                                  // }
                                  value={
                                    tripInfo.advance_payment_info
                                      ? (Number(tripInfo.advance_payment_info.low_tonnage_charges) > 0 ? Number(tripInfo.advance_payment_info.actual_freight) - Number(tripInfo.advance_payment_info.low_tonnage_charges) : tripInfo.advance_payment_info.actual_freight)
                                      : 0
                                  }
                                  readOnly
                                />
                              </CTableDataCell>

                              <CTableDataCell key={`low_tonnage_amount_data`}>
                                <CFormInput
                                  size="sm"
                                  id={`low_tonnage_amount_data`}
                                  maxLength={5}
                                  name={`low_tonnage_amount_data`}
                                  value={
                                    tripInfo.advance_payment_info
                                      ? (tripInfo.advance_payment_info.low_tonnage_charges ? tripInfo.advance_payment_info.low_tonnage_charges : 0)
                                      : 0
                                  }
                                  readOnly
                                />
                              </CTableDataCell>

                              <CTableDataCell key={`freight_total_amount_data`}>
                                <CFormInput
                                  size="sm"
                                  id={`freight_total_amount_data`}
                                  maxLength={5}
                                  name={`freight_total_amount_data`}
                                  // value={
                                  //   tripInfo.advance_payment_info
                                  //     ? Number(tripInfo.advance_payment_info.actual_freight) + Number(tripInfo.advance_payment_info.low_tonnage_charges)
                                  //     : 0
                                  // }
                                  value={
                                    tripInfo.advance_payment_info
                                      ? tripInfo.advance_payment_info.actual_freight
                                      : 0
                                  }
                                  readOnly
                                />
                              </CTableDataCell>

                              {/* Freight : Total Freight Amount Part End */}
                              {/* Freight : Advance in Diesel Part Start */}

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

                              {/* Freight : Advance in Bank Part End */}
                              {/* Freight : Total Advance Part Start */}

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
                                  value={freight_balance_amount}
                                  readOnly
                                />
                              </CTableDataCell>

                              {/* Freight : Balance Part End */}
                            </CTableRow>
                          </CTableBody>
                        </CTable>
                      </>
                    )}
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
                            tripInfo.diesel_intent_info ? tripInfo.diesel_intent_info.no_of_ltrs : ''
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
                        {/* ================== Stock Diversion / Return Charges Part Start ========= */}

                        {tripsettlementData.diversion_return_charges &&
                          tripsettlementData.diversion_return_charges != '0' && (
                            <CTableRow>
                              <CTableDataCell>Stock Diversion / Return Charges</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  value={tripsettlementData.diversion_return_charges}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                          )}
                        {/* ================== Stock Diversion / Return Charges Part End ========== */}
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
                        {/* ================== Total Charges Part Start ============ */}

                        <CTableRow>
                          <CTableDataCell>Total Expense Charges</CTableDataCell>
                          <CTableDataCell>
                            <CFormInput size="sm" value={tripsettlementData.expense} readOnly />
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
                          <CTableDataCell>
                            <b>1</b>
                          </CTableDataCell>
                          <CTableDataCell>Halt Days</CTableDataCell>
                          <CTableDataCell>
                            <CFormInput size="sm" value={tripsettlementData.halt_days} readOnly />
                          </CTableDataCell>
                        </CTableRow>
                        {tripsettlementData.expense_sap_document_no && (
                          <CTableRow>
                            <CTableDataCell>
                              <b>2</b>
                            </CTableDataCell>
                            <CTableDataCell>SAP Expense Document Number</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                size="sm"
                                value={tripsettlementData.expense_sap_document_no}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                        )}
                        {tripsettlementData.expense_posting_date && (
                          <CTableRow>
                            <CTableDataCell>
                              <b>3</b>
                            </CTableDataCell>
                            <CTableDataCell>SAP Expense Posting Date</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                size="sm"
                                value={tripsettlementData.expense_posting_date}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                        )}
                        {/* ================== Tds Having & Tds Type Part Start ======================= */}
                        <CTableRow>
                          <CTableDataCell scope="row">
                            <b>4</b>
                          </CTableDataCell>
                          <CTableDataCell>Tds Having</CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              size="sm"
                              value={getTdsTypeHaving(tripsettlementData.tds_having)}
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow>
                        {tripsettlementData.tds_having == '1' && (
                          <CTableRow>
                            <CTableDataCell scope="row">
                              <b>4 A</b>
                            </CTableDataCell>
                            <CTableDataCell>Tds Tax Type</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                size="sm"
                                value={`${tdsTaxCodeName(tripsettlementData.vendor_tds)}`}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                        )}

                        {/* ================== Tds Having & Tds Type Part End ======================= */}

                        {/* ================== SAP Text Part Start ======================= */}
                        <CTableRow>
                          <CTableDataCell scope="row">
                            <b>5</b>
                          </CTableDataCell>
                          <CTableDataCell>SAP Text</CTableDataCell>
                          <CTableDataCell>
                            <CFormInput size="sm" value={tripsettlementData.sap_text} readOnly />
                          </CTableDataCell>
                        </CTableRow>

                        {/* ================== SAP Text Part End ======================= */}
                        {/* ================== GST Tax Type Part Start ======================= */}

                        <CTableRow>
                          <CTableDataCell scope="row">
                            <b>6</b>
                          </CTableDataCell>
                          <CTableDataCell>GST Tax Type</CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              size="sm"
                              value={`${gstTaxCodeName(tripsettlementData.gst_tax_type)}`}
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow>

                        {/* ================== GST Tax Type Part End ======================= */}
                        {/* ================== HSN Tax Type Part Start ======================= */}

                        <CTableRow>
                          <CTableDataCell scope="row">
                            <b>5</b>
                          </CTableDataCell>
                          <CTableDataCell>HSN Tax Type</CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              size="sm"
                              value={`${getHSNTypeDesc(tripsettlementData.vendor_hsn)}`}
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow>

                        {/* ================== HSN Tax Type Part End ======================= */}

                        {/* ================== Others Halt Days Part End ======================= */}
                      </CTableBody>
                      {/* ================== Expense Table Body Part End ======================= */}
                    </CTable>
                  </CTabPane>
                  {/* HIre Vehicles Income Capture Start */}
                  <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 13}>
                    <CTable caption="top" hover style={{ height: '40vh' }}>
                      <CTableCaption style={{ color: 'maroon' }}>Income</CTableCaption>

                      {/* ================== Income Table Header Part Start ====================== */}
                      <CTableHead
                        style={{
                          backgroundColor: '#4d3227',
                          color: 'white',
                        }}
                      >
                        <CTableRow>
                          {/* <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            S.No
                          </CTableHeaderCell> */}

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Divisions
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Journey Type
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Document No
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Base Freight
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Updated Base Freight
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Halting Charges
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Sub Delivery Charges
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Unloading Charges
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Weighment Charges
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Low Tonage Charges
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Toll Charges
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Other Freight
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Total Freight
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      {/* ================== Expense Table Header Part End ======================= */}
                      {/* ================== Expense Table Body Part Start ======================= */}
                      <CTableBody>
                        {/* ================== Income Body Start ======================= */}

                        {tripFgsalesData.length > 0 &&
                          tripFgsalesData.map((data_fgsales, index_fgsales) => {
                            return (
                              <>
                                <CTableRow key={`fgsales_income_data${index_fgsales}`}>
                                  {/* <CTableDataCell>1</CTableDataCell> */}
                                  <CTableDataCell>
                                    {divisionFinder(data_fgsales)}
                                  </CTableDataCell>
                                  <CTableDataCell>FG-Sales</CTableDataCell>
                                  <CTableDataCell>{data_fgsales.shipment_no}</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      value={data_fgsales.shipment_freight_amount}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeVadTableItemForIncome(
                                          e,
                                          'income_base_charges',
                                          index_fgsales
                                        )
                                      }}
                                      value={vadDataUpdateforIncome(
                                        data_fgsales.income_base_charges,
                                        data_fgsales.income_base_charges_input
                                      )}
                                      maxLength={6}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeVadTableItemForIncome(
                                          e,
                                          'income_halting_charges',
                                          index_fgsales
                                        )
                                      }}
                                      value={vadDataUpdateforIncome(
                                        data_fgsales.income_halting_charges,
                                        data_fgsales.income_halting_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeVadTableItemForIncome(
                                          e,
                                          'income_sub_delivery_charges',
                                          index_fgsales
                                        )
                                      }}
                                      value={vadDataUpdateforIncome(
                                        data_fgsales.income_sub_delivery_charges,
                                        data_fgsales.income_sub_delivery_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeVadTableItemForIncome(
                                          e,
                                          'income_unloading_charges',
                                          index_fgsales
                                        )
                                      }}
                                      value={vadDataUpdateforIncome(
                                        data_fgsales.income_unloading_charges,
                                        data_fgsales.income_unloading_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>

                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeVadTableItemForIncome(
                                          e,
                                          'income_weighment_chares',
                                          index_fgsales
                                        )
                                      }}
                                      value={vadDataUpdateforIncome(
                                        data_fgsales.income_weighment_chares,
                                        data_fgsales.income_weighment_chares_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeVadTableItemForIncome(
                                          e,
                                          'income_low_tonage_charges',
                                          index_fgsales
                                        )
                                      }}
                                      value={vadDataUpdateforIncome(
                                        data_fgsales.income_low_tonage_charges,
                                        data_fgsales.income_low_tonage_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeVadTableItemForIncome(
                                          e,
                                          'income_toll_charges',
                                          index_fgsales
                                        )
                                      }}
                                      value={vadDataUpdateforIncome(
                                        data_fgsales.income_toll_charges,
                                        data_fgsales.income_toll_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeVadTableItemForIncome(
                                          e,
                                          'income_others_charges',
                                          index_fgsales
                                        )
                                      }}
                                      value={vadDataUpdateforIncome(
                                        data_fgsales.income_others_charges,
                                        data_fgsales.income_others_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>

                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      id={`shipment_hire_fgsales_freight_${index_fgsales}`}
                                      maxLength={5}
                                      defaultValue={total_freight_calculation(
                                        'fg-sales',
                                        data_fgsales
                                      )}
                                      // defaultValue={data_fgsales.shipment_freight_amount}
                                      readOnly
                                    />
                                  </CTableDataCell>

                                  {/* <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      value={data_fgsales.income_halting_charges || '0'}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      value={data_fgsales.income_sub_delivery_charges || '0'}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      value={data_fgsales.income_unloading_charges || '0'}
                                      readOnly
                                    />
                                  </CTableDataCell>

                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      value={data_fgsales.income_weighment_chares || '0'}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      value={data_fgsales.income_low_tonage_charges || '0'}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      value={data_fgsales.income_others_charges || '0'}
                                      readOnly
                                    />
                                  </CTableDataCell>

                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      value={total_freight_calculation('fg-sales', data_fgsales)}
                                      readOnly
                                    />
                                  </CTableDataCell> */}
                                </CTableRow>
                              </>
                            )
                          })
                        }

                        {tripStoData.length > 0 &&
                          tripStoData.map((data_sto, index_sto) => {
                            return (
                              <>
                                <CTableRow key={`sto_income_data${index_sto}`}>
                                  {/* <CTableDataCell>1</CTableDataCell> */}
                                  <CTableDataCell>
                                    {data_sto.sto_delivery_division == 'CONSUMER' ? 'NLCD' : 'NLFD'}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    {data_sto.sto_delivery_type == '1' ? 'FG-Sto' : 'RM-Sto'}
                                  </CTableDataCell>
                                  <CTableDataCell>{data_sto.sto_delivery_no}</CTableDataCell>
                                  {/* <CTableDataCell>{data_sto.freight_amount}</CTableDataCell> */}
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      maxLength={5}
                                      value={data_sto.freight_amount}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeStoTableItemForIncome(
                                          e,
                                          'income_base_charges',
                                          index_sto
                                        )
                                      }}
                                      value={stoDataUpdateforIncome(
                                        data_sto.income_base_charges,
                                        data_sto.income_base_charges_input
                                      )}
                                      maxLength={6}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeStoTableItemForIncome(
                                          e,
                                          'income_halting_charges',
                                          index_sto
                                        )
                                      }}
                                      value={stoDataUpdateforIncome(
                                        data_sto.income_halting_charges,
                                        data_sto.income_halting_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeStoTableItemForIncome(
                                          e,
                                          'income_sub_delivery_charges',
                                          index_sto
                                        )
                                      }}
                                      value={stoDataUpdateforIncome(
                                        data_sto.income_sub_delivery_charges,
                                        data_sto.income_sub_delivery_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>

                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeStoTableItemForIncome(
                                          e,
                                          'income_unloading_charges',
                                          index_sto
                                        )
                                      }}
                                      value={stoDataUpdateforIncome(
                                        data_sto.income_unloading_charges,
                                        data_sto.income_unloading_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>

                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeStoTableItemForIncome(
                                          e,
                                          'income_weighment_chares',
                                          index_sto
                                        )
                                      }}
                                      value={stoDataUpdateforIncome(
                                        data_sto.income_weighment_chares,
                                        data_sto.income_weighment_chares_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeStoTableItemForIncome(
                                          e,
                                          'income_low_tonage_charges',
                                          index_sto
                                        )
                                      }}
                                      value={stoDataUpdateforIncome(
                                        data_sto.income_low_tonage_charges,
                                        data_sto.income_low_tonage_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeStoTableItemForIncome(
                                          e,
                                          'income_toll_charges',
                                          index_sto
                                        )
                                      }}
                                      value={stoDataUpdateforIncome(
                                        data_sto.income_toll_charges,
                                        data_sto.income_toll_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeStoTableItemForIncome(
                                          e,
                                          'income_others_charges',
                                          index_sto
                                        )
                                      }}
                                      value={stoDataUpdateforIncome(
                                        data_sto.income_others_charges,
                                        data_sto.income_others_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>

                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      // id={`trip_sto_freight_${index_sto}`}
                                      id={
                                        data_sto.sto_delivery_type == '1'
                                          ? `trip_hire_fgsto_freight_${index_sto}`
                                          : `trip_hire_rmsto_freight_${index_sto}`
                                      }
                                      maxLength={5}
                                      defaultValue={total_freight_calculation('sto', data_sto)}
                                      // defaultValue={data_sto.freight_amount}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </CTableRow>
                              </>
                            )
                          })
                        }

                        {tripOthersStoData.length > 0 &&
                          tripOthersStoData.map((data_others_sto, index_others_sto) => {
                            return (
                              <>
                                <CTableRow key={`others_sto_income_data${index_others_sto}`}>
                                  {/* <CTableDataCell>1</CTableDataCell> */}
                                  <CTableDataCell>
                                  {vehicleRequestsData.length > 0 ? othersDivisionFinder(data_others_sto.others_vr_request_id) : '-'}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    {'OTHERS'}
                                  </CTableDataCell>
                                  <CTableDataCell>{data_others_sto.sto_delivery_no}</CTableDataCell>
                                  {/* <CTableDataCell>{data_sto.freight_amount}</CTableDataCell> */}
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      maxLength={5}
                                      value={data_others_sto.freight_amount}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeOthersStoTableItemForIncome(
                                          e,
                                          'income_base_charges',
                                          index_others_sto
                                        )
                                      }}
                                      value={othersStoDataUpdateforIncome(
                                        data_others_sto.income_base_charges,
                                        data_others_sto.income_base_charges_input
                                      )}
                                      maxLength={6}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeOthersStoTableItemForIncome(
                                          e,
                                          'income_halting_charges',
                                          index_others_sto
                                        )
                                      }}
                                      value={othersStoDataUpdateforIncome(
                                        data_others_sto.income_halting_charges,
                                        data_others_sto.income_halting_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeOthersStoTableItemForIncome(
                                          e,
                                          'income_sub_delivery_charges',
                                          index_others_sto
                                        )
                                      }}
                                      value={othersStoDataUpdateforIncome(
                                        data_others_sto.income_sub_delivery_charges,
                                        data_others_sto.income_sub_delivery_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeOthersStoTableItemForIncome(
                                          e,
                                          'income_unloading_charges',
                                          index_others_sto
                                        )
                                      }}
                                      value={othersStoDataUpdateforIncome(
                                        data_others_sto.income_unloading_charges,
                                        data_others_sto.income_unloading_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>

                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeOthersStoTableItemForIncome(
                                          e,
                                          'income_weighment_chares',
                                          index_others_sto
                                        )
                                      }}
                                      value={othersStoDataUpdateforIncome(
                                        data_others_sto.income_weighment_chares,
                                        data_others_sto.income_weighment_chares_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeOthersStoTableItemForIncome(
                                          e,
                                          'income_low_tonage_charges',
                                          index_others_sto
                                        )
                                      }}
                                      value={othersStoDataUpdateforIncome(
                                        data_others_sto.income_low_tonage_charges,
                                        data_others_sto.income_low_tonage_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeOthersStoTableItemForIncome(
                                          e,
                                          'income_toll_charges',
                                          index_others_sto
                                        )
                                      }}
                                      value={othersStoDataUpdateforIncome(
                                        data_others_sto.income_toll_charges,
                                        data_others_sto.income_toll_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeOthersStoTableItemForIncome(
                                          e,
                                          'income_others_charges',
                                          index_others_sto
                                        )
                                      }}
                                      value={othersStoDataUpdateforIncome(
                                        data_others_sto.income_others_charges,
                                        data_others_sto.income_others_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>

                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      id={`trip_others_sto_freight_${index_others_sto}`}
                                      maxLength={5}
                                      defaultValue={total_freight_calculation('others', data_others_sto)}
                                      // defaultValue={data_others_sto.freight_amount}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </CTableRow>
                              </>
                            )
                          })
                        }
                      </CTableBody>
                      {/* ================== Income Body End ======================= */}
                    </CTable>
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
                              value={totalTripIncome}
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
                            <CFormInput size="sm" id="inputAddress" value={totalTripPL} readOnly />
                          </CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                    {/* ================== P&L Body End ======================= */}
                    <CRow className="mt-2">
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="remarks">Expense Remarks</CFormLabel>
                        <CFormTextarea
                          value={values.remarks ? values.remarks : ''}
                          readOnly
                        ></CFormTextarea>
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="remarks">Income Remarks</CFormLabel>
                        <CFormTextarea
                          value={values.income_remarks ? values.income_remarks : ''}
                          readOnly
                        ></CFormTextarea>
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="settlement_remarks">Settlement Remarks</CFormLabel>
                        <CFormTextarea
                          name="settlement_remarks"
                          id="settlement_remarks"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          rows="1"
                          value={values.settlement_remarks}
                        ></CFormTextarea>
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="income_posting_date">
                          Income Posting Date <REQ />{' '}
                          {/* {errors.expected_return_date_time && (
                            <span className="small text-danger">
                              {errors.expected_return_date_time}
                            </span>
                          )} */}
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
                            e.preventDefault();
                          }}
                          value={values.income_posting_date}
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mt-5">
                      <CCol
                        xs={12}
                        md={6}
                        style={{ display: 'flex', width: '100%', flexDirection: 'row-reverse' }}
                      >
                        {/* <CButton
                          size="sm"
                          color="warning"
                          className="mx-3 text-white"
                          onClick={() => {
                            // setFetch(false)
                            TripsheetSettlementClosureCancel(2)
                          }}
                        >
                          Income Reject
                        </CButton>
                        <CButton
                          size="sm"
                          color="warning"
                          className="mx-3 text-white"
                          onClick={() => {
                            // setFetch(false)
                            TripsheetSettlementClosureCancel(1)
                          }}
                        >
                          Expense Reject
                        </CButton> */}
                        <CButton
                          size="sm"
                          color="warning"
                          className="mx-3 text-white"
                          onClick={() => {
                            // setFetch(false)
                            TripsheetIncomeClosureSubmit()
                            // setSettlementSubmit(true)
                          }}
                          type="submit"
                        >
                          Submit
                        </CButton>
                      </CCol>
                    </CRow>
                  </CTabPane>
                  {/* Hire Vehicle Income Capture End */}
                </CTabContent>
              </CTabPane>

              <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={mainKey === 2}>
                {/*  Own / Contract Vehicles Part Header Tab End */}
                <CNav variant="tabs" role="tablist">
                  <CNavItem>
                    <CNavLink active={activeKey_2 === 1} onClick={() => setActiveKey_2(1)}>
                      General Information
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink active={activeKey_2 === 12} onClick={() => setActiveKey_2(12)}>
                      Overall Journey Information
                    </CNavLink>
                  </CNavItem>
                  {/*
                  {fg_sales_enable && (
                    <>
                      <CNavItem>
                        <CNavLink active={activeKey_2 === 2} onClick={() => setActiveKey_2(2)}>
                          FJ Information
                        </CNavLink>
                      </CNavItem>
                    </>
                  )} */}
                  {rjso_enable && (
                    <>
                      <CNavItem>
                        <CNavLink
                          active={activeKey_2 === 9}
                          onClick={() => setActiveKey_2(9)}
                          // disabled={true}
                        >
                          RJ Information
                        </CNavLink>
                      </CNavItem>
                    </>
                  )}
                  {/*{((sto_enable && tripInfo.tripsheet_info.purpose == '2') || fgstoAvailable) && (
                    <>
                      <CNavItem>
                        <CNavLink active={activeKey_2 === 4} onClick={() => setActiveKey_2(4)}>
                          FGSTO Information
                        </CNavLink>
                      </CNavItem>
                    </>
                  )}
                  {((sto_enable && tripInfo.tripsheet_info.purpose == '3') || rmstoAvailable) && (
                    <>
                      <CNavItem>
                        <CNavLink active={activeKey_2 === 10} onClick={() => setActiveKey_2(10)}>
                          RMSTO Information
                        </CNavLink>
                      </CNavItem>
                    </>
                  )} */}

                  <CNavItem>
                    <CNavLink active={activeKey_2 === 5} onClick={() => setActiveKey_2(5)}>
                      Diesel Information
                    </CNavLink>
                  </CNavItem>
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
                    <CNavLink active={activeKey_2 === 3} onClick={() => setActiveKey_2(3)}>
                      Expenses
                    </CNavLink>
                  </CNavItem>

                  <CNavItem>
                    <CNavLink active={activeKey_2 === 13} onClick={() => setActiveKey_2(13)}>
                      Income
                    </CNavLink>
                  </CNavItem>

                  <CNavItem>
                    <CNavLink active={activeKey_2 === 7} onClick={() => setActiveKey_2(7)}>
                      Advance
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
                            tripInfo && tripInfo.tripsheet_info ? tripInfo.tripsheet_info.nlmt_tripsheet_no : ''
                          }
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="vNum1">Vehicle Number</CFormLabel>

                        <CFormInput size="sm" id="vNum1" value={tripInfo?.vehicle_info?.vehicle_number} readOnly />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="vCap1">Vehicle Capacity in MTS</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="vCap1"
                                 value={
                            mastersLoaded
                              ? `${getDefinitionName(
                                vehicleCapacity,
                                tripInfo?.vehicle_info?.vehicle_capacity_id
                              )}`
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
                          value={vehicle_type_find(tripInfo.vehicle_info.vehicle_type_id )}
                          readOnly
                        />
                      </CCol>
                      {tripInfo.driver_info && (
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="dName">Driver Name & Code</CFormLabel>

                        <CFormInput size="sm" id="dName" value={`${tripInfo.driver_name} - ${tripInfo.driver_info.driver_code}`} readOnly />
                      </CCol>
                    )}
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="dMob1">Driver Mobile Number</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="dMob1"
                          value={tripInfo.driver_contact_number}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="OdometerKM">Odometer Opening KM</CFormLabel>

                        <CFormInput size="sm" id="OdometerKM" value={tripInfo.odometer_km} readOnly />
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
                        <CFormLabel htmlFor="inputAddress">Gate-In Date & Time</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="inputAddress"
                          value={tripInfo.gate_in_date_time_string}
                          readOnly
                        />
                      </CCol>
                      {!sto_enable && (
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="inspectionDateTime">Inspection Date Time</CFormLabel>
                          <CFormInput
                            size="sm"
                            id="inspectionDateTime"
                            value={
                              tripInfo.vehicle_inspection_trip
                                ? tripInfo.vehicle_inspection_trip.inspection_time_string
                                : ''
                            }
                            readOnly
                          />
                        </CCol>
                      )}
                      {/* <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="verifyDate">Doc. Verify Time</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="verifyDate"
                          value="21 Sep 2021 12:00:00 PM"
                          readOnly
                        />
                      </CCol> */}

                      {/* <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="gateOut">Gate Out Date & Time</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="gateOut"
                          value={tripInfo.gate_out_date_time_string}
                          readOnly
                        />
                      </CCol> */}

                      {/* <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="gateInDateTime">Gate-In Time</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="gateInDateTime"
                          value="24 Sep 2021 12:00:00 PM"
                          readOnly
                        />
                      </CCol> */}
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
                          value={tripKMFinder(tripInfo.odometer_km, tripInfo.odometer_closing_km)}
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

                        <CFormInput size="sm" value={tripsettlementData.budgeted_mileage} readOnly />
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="actualMileage">Actual Mileage</CFormLabel>

                        <CFormInput size="sm" value={tripsettlementData.actual_mileage} readOnly />
                      </CCol>

                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="diffmil">Diff. Mileage</CFormLabel>

                        <CFormInput size="sm" id="diffmil" value={differenceMileageFinder} readOnly />
                      </CCol>
                      {tripInfo && tripInfo.tripsheet_info && (
                        <CCol xs={12} md={3}>
                          <CFormLabel htmlFor="diffmil">Trip Purpose</CFormLabel>

                          <CFormInput size="sm" id="diffmil" value={tripPurposeFinder(tripInfo.tripsheet_info.purpose)} readOnly />
                        </CCol>
                      )}
                    </CRow>
                    {tripInfo && tripInfo.tripsheet_info && tripInfo.tripsheet_info.purpose == 4 && (
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
                        { !smallFetch && <SmallLoader />}
                        { smallFetch && vehicleRequestsData.map((currentVrData,kk)=>{
                          return (
                            <>
                              <CRow>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="tNum">{kk+1} ) VR No</CFormLabel>
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
                                  <CFormLabel htmlFor="tNum">Purpose</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="tNum"
                                    value={(purp_finder(currentVrData.vr_purpose))}
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
                                  <CFormLabel htmlFor="tNum">Vehicle Capacity (TON)</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="tNum"
                                    value={veh_capacity_finder(currentVrData.vr_capacity_id)}
                                    readOnly
                                  />
                                </CCol>
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="tNum">Vehicle Body Type / Variety</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="tNum"
                                    value={`${veh_body_finder(currentVrData.vr_body_id)} / ${veh_variety_finder(currentVrData.vr_variety_id) || '-'}`}
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

                  {/* Own/Contract Vehicle Overall Journey Information Part Start */}

                  <CTabPane
                    role="tabpanel"
                    aria-labelledby="profile-tab"
                    visible={activeKey_2 === 12}
                  >
                    {tripFgsalesData && tripFgsalesData.length > 0 && (
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
                          fgsalesJourneyInfo={tripFgsalesData}
                          title="FG-Sales Information"
                        />
                        <hr />
                      </>
                    )}
                    {/* {tripRjsoData && tripRjsoData.length > 0 && (
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
                              RJSO Information
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        <RJSOJourneyInfo rjsoJourneyInfo={tripRjsoData} title="RJSO Information" />
                        <hr />
                      </>
                    )} */}
                    {tripStoData && tripStoData.length > 0 && JourneyInfoExists(1, tripStoData) &&  (
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
                              STO Information
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        <NlmtRMSTOJourneyInfo rmstoJourneyInfo={tripStoData} title="STO Information" />
                        <hr />
                      </>
                    )}
                    {tripStoData && tripStoData.length > 0 && JourneyInfoExists(2, tripStoData) && (
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
                              Rake Information
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        <NlmtRakeJourneyInfo rmstoJourneyInfo={tripStoData} title="Rake Information" />
                        <hr />
                      </>
                    )}
                    {tripStoData && tripStoData.length > 0 && JourneyInfoExists(3, tripStoData) &&  (
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
                              FCI Information
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        <NlmtFCIJourneyInfo rmstoJourneyInfo={tripStoData} title="FCI Information" />
                        <hr />
                      </>
                    )}
                    {tripOthersStoData && tripOthersStoData.length > 0 && (
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
                              Others Information
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        <OthersJourneyInfo tripInfo={tripInfo} othersJourneyInfo={tripOthersStoData} title="Others Information" />
                        <hr />
                      </>
                    )}
                  </CTabPane>

                  {/* Own/Contract Vehicle Overall Journey Information Part End */}

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
                                      <CFormLabel htmlFor="sInvoice">Invoice Number</CFormLabel>

                                      <CFormInput
                                        size="sm"
                                        id="sInvoice"
                                        value={val.invoice_no}
                                        readOnly
                                      />
                                    </CCol>
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
                                      <CFormLabel htmlFor="cNum">Customer Code</CFormLabel>

                                      <CFormInput
                                        size="sm"
                                        id="cNum"
                                        value={val.customer_info.CustomerCode}
                                        readOnly
                                      />
                                    </CCol>
                                    <CCol xs={12} md={2}>
                                      <CFormLabel htmlFor="sDelivery">
                                        Delivery Date & Time <REQ />
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
                                    </CCol>
                                    <CCol xs={12} md={2}>
                                      <CFormLabel htmlFor="unload2">
                                        Unloading Charges <REQ />
                                      </CFormLabel>

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
                                    </CCol>
                                    <CCol xs={12} md={2}>
                                      <CFormLabel htmlFor="fjPod">
                                        FJ POD Copy <REQ />
                                      </CFormLabel>

                                      <CFormInput
                                        size="sm"
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) => {
                                          changeVadTableItem(e, 'fj_pod_copy', index, val_index)
                                        }}
                                        value={vadDataUpdate(val.fj_pod_copy, val.fj_pod_copy_input)}
                                      />
                                      {val.fj_pod_copy_validated === false && (
                                        <span className="small text-danger">
                                          FJ POD Copy Should be Filled
                                        </span>
                                      )}
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

                  <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey_2 === 9}>
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
                                value={data.actual_delivery_date_time}
                                readOnly
                                // type="datetime-local"
                                // onChange={(e) => {
                                //   changeRjsoTableItem(e, 'actual_delivery_date_time', index)
                                // }}
                                // value={rjsoDataUpdate(
                                //   data.actual_delivery_date_time,
                                //   data.actual_delivery_date_time_input
                                // )}
                              />
                            </CCol>

                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="rUnload">Unloading Charges</CFormLabel>

                              <CFormInput
                                size="sm"
                                value={data.unloading_charges}
                                // type="text"
                                // onChange={(e) => {
                                //   changeRjsoTableItem(e, 'unloading_charges', index)
                                // }}
                                // value={rjsoDataUpdate(
                                //   data.unloading_charges,
                                //   data.unloading_charges_input
                                // )}
                                maxLength={5}
                                readOnly
                              />
                            </CCol>
                            {/* Own Vehicle RJ Shed Copy - OVRJSC */}
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="rPOD">RJ Shed Copy</CFormLabel>
                              <div className="d-grid gap-2">

                                <CButton
                                  className="text-justify"
                                  color="info"
                                  size="sm"
                                  id="odoImg"
                                >
                                  <CNavLink style={{'color':'blue'}} href={`${data.rj_shed_copy}`} target={'_blank'}>
                                    <i style={{marginRight:"5px"}} className="fa fa-eye"></i>View
                                  </CNavLink>
                                </CButton>
                              </div>
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="rPOD">RJ POD Copy</CFormLabel>
                              <div className="d-grid gap-2">
                                <CButton
                                  className="text-justify"
                                  color="info"
                                  size="sm"
                                  id="odoImg"
                                  // onClick={() => setOopVisible(!oopVisible)}
                                >
                                  <span className="float-start">
                                    <i className="fa fa-eye"></i> &nbsp; View
                                  </span>
                                </CButton>
                              </div>
                              {/* <CFormInput
                                size="sm"
                                type="file"
                                onChange={(e) => {
                                  changeRjsoTableItem(e, 'rj_pod_copy', index)
                                }}
                                // value={rjsoDataUpdate(data.rj_pod_copy, data.rj_pod_copy_input)}
                              /> */}
                            </CCol>
                            <CCol md={2}>
                              <CFormLabel htmlFor="DefectType">Defect Type</CFormLabel>

                              <CFormSelect
                                size="sm"
                                // onChange={(e) => {
                                //   changeRjsoTableItem(e, 'defect_type', index)
                                // }}
                                // readOnly defect_type
                                disabled
                                // value={rjsoDataUpdate(data.defect_type, data.defect_type_input)}
                                value={data.defect_type}
                              >
                                <option value="">Select Types</option>

                                <option value="1">Unloading Charges</option>

                                <option value="2">Subdelivery Charges</option>

                                <option value="3">Halting Charges</option>

                                <option value="4">Low Tonage</option>
                              </CFormSelect>
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="rUnload">Freight Income</CFormLabel>
                              <CFormInput size="sm" value={data.freight_income} readOnly />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="rUnload">Advance Amount</CFormLabel>
                              <CFormInput size="sm" value={data.advance_amount} readOnly />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="rUnload">Advance Payment Mode</CFormLabel>
                              {/* <CFormInput size="sm" value={data.advance_payment_mode} readOnly /> */}
                              <CFormSelect
                                size="sm"
                                // onChange={(e) => {
                                //   changeRjsoTableItem(e, 'defect_type', index)
                                // }}
                                // readOnly defect_type
                                disabled
                                // value={rjsoDataUpdate(data.defect_type, data.defect_type_input)}
                                value={data.advance_payment_mode}
                              >
                                <option value="">Select Mode</option>

                                {pmData.map(({ definition_list_code, definition_list_name }) => {
                                  if (definition_list_code) {
                                    return (
                                      <>
                                        <option
                                          key={definition_list_code}
                                          value={definition_list_code}
                                        >
                                          {definition_list_name}
                                        </option>
                                      </>
                                    )
                                  }
                                })}
                              </CFormSelect>
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="rUnload">Advance Received Time</CFormLabel>
                              <CFormInput
                                size="sm"
                                value={data.advance_payment_received_time}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel htmlFor="rUnload">Balance Amount</CFormLabel>
                              <CFormInput size="sm" value={data.balance_amount} readOnly />
                            </CCol>

                            { data.balance_amount != 0 && (
                              <>
                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="rUnload">Balance Payment Mode</CFormLabel>
                                  {/* <CFormInput size="sm" value={data.balance_payment_mode} readOnly /> */}

                                  <CFormSelect
                                    size="sm"
                                    value={data.balance_payment_mode}
                                    disabled
                                    // value={data.balance_payment_mode}
                                  >
                                    <option value="">Select Mode</option>

                                    {pmData.map(({ definition_list_code, definition_list_name }) => {
                                      if (definition_list_code) {
                                        return (
                                          <>
                                            <option
                                              key={definition_list_code}
                                              value={definition_list_code}
                                            >
                                              {definition_list_name}
                                            </option>
                                          </>
                                        )
                                      }
                                    })}
                                  </CFormSelect>
                                </CCol>

                                <CCol xs={12} md={2}>
                                  <CFormLabel htmlFor="rUnload">Balance Received</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    value={data.balance_payment_received == '1' ? 'Yes ✔️' : 'No ❌'}
                                    readOnly
                                  />
                                </CCol>
                                {data.balance_payment_received == '1' && (
                                  <>
                                    <CCol xs={12} md={2}>
                                      <CFormLabel htmlFor="rUnload">Balance Received Time</CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        value={data.balance_payment_received_time}
                                        readOnly
                                      />
                                    </CCol>
                                  </>
                                )}
                              </>)
                            }
                          </CRow>
                        </>
                      )
                    })}
                  </CTabPane>

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
                                    value={stoValues.sto_delivery_number}
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
                                value={stoValues.sto_po_number}
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
                                value={stoValues.sto_from_location}
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
                                value={stoValues.sto_to_location}
                                // onChange={(e) => handleStoValueChange(e)}
                                name={sto_to_location}
                                maxLength={30}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel>Delivery Quantity in MTS</CFormLabel>

                              <CFormInput
                                size="sm"
                                // type="number"
                                value={stoValues.sto_delivery_quantity}
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
                                value={stoValues.sto_freight_amount}
                                // onChange={(e) => handleStoValueChange(e)}
                                name={sto_freight_amount}
                                maxLength={6}
                                readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel>
                                Delivery Date and Time <REQ />
                              </CFormLabel>

                              <CFormInput
                                size="sm"
                                type="datetime-local"
                                value={stoValues.sto_delivery_date_time}
                                onChange={(e) => handleStoValueChange(e)}
                                name={sto_delivery_date_time}
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel>
                                POD Copy <REQ />
                              </CFormLabel>
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
                            <CCol md={2}>
                              <CFormLabel>
                                Driver Name <REQ />{' '}
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                value={stoValues.sto_delivery_driver_name}
                                onChange={(e) => handleStoValueChange(e)}
                                name={sto_delivery_driver_name}
                              >
                                {/* <AllDriverListSelectComponent /> */}
                                <AllDriverListNameSelectComponent />
                              </CFormSelect>{' '}
                            </CCol>
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

                      <div className="App" style={{ display: 'flex', flexDirection: 'row-reverse' }}>
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
                        hireVehicle={tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id == 3 ? true : false}
                      />
                    </CTabPane>
                  )}
                  {/* Own Vehicle FG-STO Info Tab END================================== */}
                  {/* Own Vehicle RMSTO Info Tab START================================= */}
                  {tabGISuccess && (
                    <CTabPane
                      role="tabpanel"
                      aria-labelledby="contact-tab"
                      visible={activeKey_2 === 10}
                    >
                      <div className="App">
                        <div>
                          <CRow className="mt-2">
                            <CCol md={2}>
                              <CFormLabel>
                                STO Delivery Number <REQ />
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                value={stoValuesRMSTO.sto_delivery_number_rmsto}
                                onChange={(e) => handleStoValueChangeRMSTO(e)}
                                name={sto_delivery_number_rmsto}
                                maxLength={10}
                              />
                            </CCol>
                            <CCol md={2}>
                              <CFormLabel>
                                STO PO Number <REQ />
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                value={stoValuesRMSTO.sto_po_number_rmsto}
                                onChange={(e) => handleStoValueChangeRMSTO(e)}
                                name={sto_po_number_rmsto}
                                maxLength={10}
                                // readOnly
                              />
                            </CCol>
                            <CCol md={2}>
                              <CFormLabel>
                                Division <REQ />
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                value={stoValuesRMSTO.sto_delivery_division_rmsto}
                                onChange={(e) => handleStoValueChangeRMSTO(e)}
                                name={sto_delivery_division_rmsto}
                                maxLength={1}
                                // readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel>
                                From Location <REQ />
                              </CFormLabel>

                              <CFormInput
                                size="sm"
                                value={stoValuesRMSTO.sto_from_location_rmsto}
                                onChange={(e) => handleStoValueChangeRMSTO(e)}
                                name={sto_from_location_rmsto}
                                maxLength={30}
                                // readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel>
                                To Location <REQ />
                              </CFormLabel>

                              <CFormInput
                                size="sm"
                                value={stoValuesRMSTO.sto_to_location_rmsto}
                                onChange={(e) => handleStoValueChangeRMSTO(e)}
                                name={sto_to_location_rmsto}
                                maxLength={30}
                                // readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel>
                                Delivery Quantity in MTS <REQ />
                              </CFormLabel>

                              <CFormInput
                                size="sm"
                                // type="number"
                                value={stoValuesRMSTO.sto_delivery_quantity_rmsto}
                                onChange={(e) => handleStoValueChangeRMSTO(e)}
                                name={sto_delivery_quantity_rmsto}
                                maxLength={5}
                                // readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel>
                                Freight Amount <REQ />
                              </CFormLabel>

                              <CFormInput
                                size="sm"
                                value={stoValuesRMSTO.sto_freight_amount_rmsto}
                                onChange={(e) => handleStoValueChangeRMSTO(e)}
                                name={sto_freight_amount_rmsto}
                                maxLength={6}
                                // readOnly
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel>
                                Delivery Date and Time <REQ />
                              </CFormLabel>

                              <CFormInput
                                size="sm"
                                type="datetime-local"
                                value={stoValuesRMSTO.sto_delivery_date_time_rmsto}
                                onChange={(e) => handleStoValueChangeRMSTO(e)}
                                name={sto_delivery_date_time_rmsto}
                              />
                            </CCol>
                            <CCol xs={12} md={2}>
                              <CFormLabel>
                                POD Copy <REQ />
                              </CFormLabel>
                              {stoFileUploadVisibleRMSTO ? (
                                <CFormInput
                                  type="file"
                                  size="sm"
                                  value={stoValuesRMSTO.sto_pod_copy_rmsto}
                                  // onChange={(e) => handleStoValueChange(e)}
                                  onChange={(e) => handleStoFileUploadChangeRMSTO(e)}
                                  name={sto_pod_copy_rmsto}
                                />
                              ) : (
                                <CButton className="w-100 m-0" color="info" size="sm" id="dInvoice">
                                  <span
                                    className="float-start"
                                    onClick={() => setStoPodVisibleRMSTO(true)}
                                  >
                                    <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
                                  </span>
                                  <span
                                    className="float-end"
                                    onClick={() => {
                                      if (window.confirm('Are you sure to remove this file?')) {
                                        stoPodUploadResetEditRMSTO()
                                      }
                                    }}
                                  >
                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                  </span>
                                </CButton>
                              )}
                            </CCol>
                            {/* {stoValues.sto_pod_copy && <img src={filePath} />} */}
                            <CCol md={2}>
                              <CFormLabel>
                                Driver Name <REQ />{' '}
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                value={stoValuesRMSTO.sto_delivery_driver_name_rmsto}
                                onChange={(e) => handleStoValueChangeRMSTO(e)}
                                name={sto_delivery_driver_name_rmsto}
                              >
                                {/* <AllDriverListSelectComponent /> */}
                                <AllDriverListNameSelectComponent />
                              </CFormSelect>{' '}
                            </CCol>
                            {/* <CCol xs={12} md={2}>
                              <CFormLabel>Expense To Be Capture</CFormLabel>

                              <CTableDataCell scope="row">
                                <input
                                  className="form-check-input"
                                  style={{ minHeight: '18px !important' }}
                                  type="checkbox"
                                  // defaultChecked={false}
                                  checked={stoValuesRMSTO.sto_delivery_expense_capture_rmsto}
                                  // type="checkbox"
                                  value={stoValuesRMSTO.sto_delivery_expense_capture_rmsto}
                                  // onChange={(e) => handleStoValueChange(e)}
                                  onChange={(e) => handleStoExpenseCaptureChangeRMSTO(e)}
                                  name={sto_delivery_expense_capture_rmsto}
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

                      <div className="App" style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                        <CButton
                          className="m-2"
                          disabled={!isStoEditModeRMSTO && stoDeliveryInvalidRMSTO ? true : false}
                          onClick={onStoSubmitBtnRMSTO}
                          color="primary"
                        >
                          {isStoEditModeRMSTO ? 'Update' : 'Add'}
                        </CButton>{' '}
                        <CButton className="m-2" onClick={onStoSubmitCancelBtnRMSTO} color="primary">
                          Clear
                        </CButton>
                        {isStoEditModeRMSTO && (
                          <CButton className="m-2" onClick={stoResetEditRMSTO} color="primary">
                            Cancel Edit
                          </CButton>
                        )}
                        <br />
                      </div>
                      <hr />
                      <StoTableRMSTOComponent
                        stoTableDataRMSTO={stoTableDataRMSTO}
                        title="STO Information Table"
                        onEdit={onStoEditcallbackRMSTO}
                        onDelete={onStoDeleteCallbackRMSTO}
                        isStoEditModeRMSTO={isStoEditModeRMSTO}
                        hireVehicle={tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id == 3 ? true : false}
                      />
                    </CTabPane>
                  )}
                  {/* Own Vehicle RMSTO Info Tab END====================================== */}
                  {/* Own Vehicle Diesel Indent Info Tab Start============================ */}
                  <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey_2 === 5}>
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
                    {dieselCollectionInfo.map((data, index) => {
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
                                    data.diesel_vendor_sap_invoice_no == null ? '-' : data.no_of_ltrs
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
                                        <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;View
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
                              {adhardel && (
                                <CCol xs={12} md={3}>
                                  <CFormLabel htmlFor="AadharCard">Aadhar Card*</CFormLabel>
                                  <CFormInput type="file" name="AadharCard" size="sm" id="" />
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
                    {dieselCollectionInfo.map((data, index) => {
                      if (data.diesel_type == '1') {
                        return (
                          <>
                            <CRow className="mt-2" hidden>
                              <CCol md={2}>
                                <CFormLabel htmlFor="rVendor">Outstation Reg. Vendor </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="rNum"
                                  value={getDieselVendorNameById(data.diesel_vendor_id)}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="dltr1">Diesel Liter</CFormLabel>

                                <CFormInput size="sm" id="rNum" value={data.no_of_ltrs} readOnly />
                              </CCol>
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="rltr">Rate Per Liter</CFormLabel>

                                <CFormInput size="sm" id="rNum" value={data.rate_of_ltrs} readOnly />
                              </CCol>
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="tAmount">Total Amount</CFormLabel>
                                <CFormInput size="sm" id="rNum" value={data.total_amount} readOnly />
                              </CCol>
                              <CCol xs={12} md={2}>
                                <CFormLabel htmlFor="dInvoice">Invoice Copy</CFormLabel>

                                <CButton className="w-100 m-0" color="info" size="sm" id="dInvoice">
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
                          readOnly
                          value={tripsettlementData.enroute_vendor || '-'}
                        />
                      </CCol>
                      <CCol xs={12} md={2}>
                        <CFormLabel htmlFor="urvDieselLiter">Diesel Liter</CFormLabel>

                        <CFormInput
                          size="sm"
                          readOnly
                          value={tripsettlementData.enroute_diesel_liter || '-'}
                        />
                      </CCol>
                      <CCol xs={12} md={2}>
                        <CFormLabel htmlFor="urvDieselRate">Rate Per Liter</CFormLabel>

                        <CFormInput
                          size="sm"
                          readOnly
                          value={tripsettlementData.enroute_diesel_rate || '-'}
                        />
                      </CCol>
                      <CCol xs={12} md={2}>
                        <CFormLabel htmlFor="urvDieselAmount">Total Amount </CFormLabel>

                        <CFormInput
                          size="sm"
                          readOnly
                          value={tripsettlementData.enroute_diesel_amount || '-'}
                        />
                      </CCol>

                      <CCol xs={12} md={2}>
                        <CFormLabel htmlFor="dInvoice">Invoice Copy</CFormLabel>

                        <CButton className="w-100 m-0" color="info" size="sm" id="dInvoice">
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
                          value={tdlDieselInfo ? parseFloat(tdlDieselInfo.toFixed(2)) : ''}
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
                          value={arplDieselInfo ? parseFloat(arplDieselInfo.toFixed(2)) : ''}
                          readOnly
                        />
                      </CCol>
                      <CCol xs={12} md={2}>
                        <CFormLabel htmlFor="rvTotalDieselAmount">Total Diesel Amount</CFormLabel>

                        <CFormInput
                          size="sm"
                          id="rvTotalDieselAmount"
                          name="rvTotalDieselAmount"
                          value={tdaDieselInfo ? parseFloat(tdaDieselInfo.toFixed(2)) : ''}
                          readOnly
                        />
                      </CCol>
                    </CRow>
                    <hr />
                    {/* <ReactTable /> */}

                    {/* ----------------Diesel Consumption & Runnnig KM :---------------------------*/}
                    {/* <CRow className="mt-2" hidden>
                      <CCol xs={12} md={3}>
                        <CFormLabel
                          htmlFor="inputAddress"
                          style={{
                            backgroundColor: '#4d3227',
                            color: 'white',
                          }}
                        >

                          Diesel Consumption Ltr (Aprox.) & Runnnig KM{' '}
                        </CFormLabel>
                      </CCol>
                    </CRow> */}
                    {/* {shipmentInfo && shipmentInfo.length > 0 && (
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
                                  <CFormLabel htmlFor="openKM">
                                    Opening KM <REQ />
                                  </CFormLabel>

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
                                  <CFormLabel htmlFor="closeKM">
                                    Closing KM <REQ />
                                  </CFormLabel>

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
                                    value={siData.shipment_qty}
                                    readOnly
                                  />
                                </CCol>
                              </CRow>
                            </>
                          )
                        })}
                        <hr />
                      </>
                    )} */}

                    {/* {rjsoInfo && rjsoInfo.length > 0 && (
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
                                  <CFormLabel htmlFor="openKM">
                                    Opening KM <REQ />
                                  </CFormLabel>

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
                                  <CFormLabel htmlFor="closeKM">
                                    Closing KM <REQ />
                                  </CFormLabel>

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
                    )} */}

                    {/* {stoTableData && stoTableData.length > 0 && (
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
                                    value={fgstoData.sto_delivery_number}
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
                                  <CFormLabel htmlFor="openKM">
                                    Opening KM <REQ />
                                  </CFormLabel>

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
                                  <CFormLabel htmlFor="closeKM">
                                    Closing KM <REQ />
                                  </CFormLabel>

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
                    )} */}

                    {/* {stoTableDataRMSTO && stoTableDataRMSTO.length > 0 && (
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
                          return (
                            <>
                              <CRow className="mt-2" key={`rmstoData${index}`}>
                                <CCol md={2}>
                                  <CFormLabel htmlFor="fjNum">RMSTO Delivery Number </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="fjNum"
                                    value={rmstoData.sto_delivery_number_rmsto}
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
                                  <CFormLabel htmlFor="openKM">
                                    Opening KM <REQ />
                                  </CFormLabel>

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
                                  <CFormLabel htmlFor="closeKM">
                                    Closing KM <REQ />
                                  </CFormLabel>

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
                        })}
                        <hr />
                      </>
                    )} */}

                    {/* ----------------------------------------------------------------------------*/}
                    {/* ============ Own Vehicle Diesel Indent Info Tab End ==================== */}
                  </CTabPane>
                  <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey_2 === 6}>
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
                  <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey_2 === 3}>
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
                      style={{ height: '70vh' }}
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
                        {/* ================== Expense Fasttag Toll Amount Start ======================= */}

                       {/* {tripsettlementData.fasttag_toll_amount && tripsettlementData.fasttag_toll_amount != '0' && (
                        <CTableRow>
                          <CTableDataCell>Fast-Tag Toll Amount</CTableDataCell>
                          <CTableDataCell>
                            <CFormInput size="sm" value={tripsettlementData.fasttag_toll_amount}  />
                          </CTableDataCell>
                        </CTableRow>
                      )} */}
                      {/* ================== Expense Fasttag Toll Amount Part End ======================= */}
                      {/* ================== Expense Other Toll Amount Start ======================= */}

                      {tripsettlementData.toll_amount && tripsettlementData.toll_amount != '0' && (
                        <CTableRow>
                          <CTableDataCell>Toll Amount</CTableDataCell>
                          <CTableDataCell>
                            <CFormInput size="sm" value={tripsettlementData.toll_amount} readOnly />
                          </CTableDataCell>
                        </CTableRow>
                      )}
                      {/* ================== Expense Other Toll Amount Part End ======================= */}
                        {/* ================== Expense Bata Part Start ======================= */}

                        {tripsettlementData.bata && tripsettlementData.bata != '0' && (
                          <CTableRow>
                            <CTableDataCell>Bata</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput size="sm" value={tripsettlementData.bata} readOnly />
                            </CTableDataCell>
                          </CTableRow>
                        )}

                        {/* ================== Expense Bata Part End ======================= */}
                        {/* ================== Municipal Charges Part Start ======================= */}

                        {tripsettlementData.municipal_charges &&
                          tripsettlementData.municipal_charges != '0' && (
                            <CTableRow>
                              <CTableDataCell>Municipal Charges</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  value={tripsettlementData.municipal_charges}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                          )}

                        {/* ================== Municipal Charges Part End ======================= */}
                        {/* ================== Registerd Diesel Amount Part Start ======================= */}

                        {tripsettlementData.registered_diesel_amount != '0' && (
                            <CTableRow>
                              <CTableDataCell>Registered Diesel Amount</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  value={tripsettlementData.registered_diesel_amount}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                          )}

                        {tripsettlementData.registered_diesel_amount == 0 &&
                          tdaDieselInfo &&
                          tdaDieselInfo != '0' && (
                            <CTableRow>
                              <CTableDataCell>Registered Diesel Amount</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput size="sm" value={Number(rvTotalValues.rvTotalDieselAmount)} readOnly />
                              </CTableDataCell>
                            </CTableRow>
                          )}

                        {/* ================== Registerd Diesel Amount Part End ======================= */}
                        {/* ================== Enroute Diesel Amount Part Start ======================= */}

                        {tripsettlementData.enroute_diesel_amount != '0' && (
                            <CTableRow>
                              <CTableDataCell>Enroute Diesel Amount</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  value={tripsettlementData.enroute_diesel_amount}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                          )}

                        {/* ================== Enroute Diesel Part End ======================= */}
                        {/* ================== Port Entry Fee Part Start ======================= */}

                        {tripsettlementData.port_entry_fee &&
                          tripsettlementData.port_entry_fee != '0' && (
                            <CTableRow>
                              <CTableDataCell>Port Entry Fee</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  value={tripsettlementData.port_entry_fee}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                          )}

                        {/* ================== Port Entry Fee Part End ======================= */}
                        {/* ================== Misc Charges Part Start ======================= */}

                        {tripsettlementData.misc_charges && tripsettlementData.misc_charges != '0' && (
                          <CTableRow>
                            <CTableDataCell>Misc Charges</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                size="sm"
                                value={tripsettlementData.misc_charges}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                        )}

                        {/* ================== Misc Charges Part End ======================= */}
                        {/* ================== Fine Amount Part Start ======================= */}

                        {tripsettlementData.fine_amount && tripsettlementData.fine_amount != '0' && (
                          <CTableRow>
                            <CTableDataCell>Fine Amount</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput size="sm" value={tripsettlementData.fine_amount} readOnly />
                            </CTableDataCell>
                          </CTableRow>
                        )}

                        {/* ================== Fine Amount Part End ======================= */}
                        {/* ================== Subdelivery Charges Part Start ======================= */}

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
                        {/* ================== Maintenance Cost Part Start ======================= */}

                        {tripsettlementData.maintenance_cost &&
                          tripsettlementData.maintenance_cost != '0' && (
                            <CTableRow>
                              <CTableDataCell>Maintenance Cost</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  value={tripsettlementData.maintenance_cost}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                          )}

                        {/* ================== Maintenance Cost Part End ======================= */}
                        {/* ================== Loading Charges Part Start ======================= */}

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

                        {/* ================== Loading Charges Part End ======================= */}
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
                        {/* ================== Tarpaulin Charges Part Start ======================= */}

                        {tripsettlementData.tarpaulin_charges &&
                          tripsettlementData.tarpaulin_charges != '0' && (
                            <CTableRow>
                              <CTableDataCell>Tarpaulin Charges</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  value={tripsettlementData.tarpaulin_charges}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                          )}

                        {/* ================== Tarpaulin Charges Part End ======================= */}
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
                        {/* ================== Low Tonage Charges Part Start ======================= */}

                        {tripsettlementData.low_tonage_charges &&
                          tripsettlementData.low_tonage_charges != '0' && (
                            <CTableRow>
                              <CTableDataCell>Low Tonage Charges</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  value={tripsettlementData.low_tonage_charges}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                          )}

                        {/* ================== Low Tonage Charges Part End ======================= */}
                        {/* ================== Stock Diversion / Return Charges Part Start ============ */}

                        {tripsettlementData.diversion_return_charges &&
                          tripsettlementData.diversion_return_charges != '0' && (
                            <CTableRow>
                              <CTableDataCell>Stock Diversion / Return Charges</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  value={tripsettlementData.diversion_return_charges}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                          )}

                        {/* ================== Stock Diversion / Return Charges Part End ========== */}
                        {/* ================== Halt Bata Amount Start ======================= */}

                        {tripsettlementData.halt_bata_amount &&
                          tripsettlementData.halt_bata_amount != '0' && (
                            <CTableRow>
                              <CTableDataCell>Halt Bata Amount</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  value={tripsettlementData.halt_bata_amount}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                          )}
                        {/* ================== Halt Bata Amount Part End ======================= */}
                        {/* ================== Local Bata Amount Start ======================= */}

                        {tripsettlementData.local_bata_amount &&
                          tripsettlementData.local_bata_amount != '0' && (
                            <CTableRow>
                              <CTableDataCell>Local Bata Amount</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  value={tripsettlementData.local_bata_amount}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                          )}
                        {/* ================== Local Bata Amount Part End ======================= */}
                        {/* ==================== RJSO Additional Expenses Part Start ==================== */}
                      {tripInfo && tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id === 1 && tripInfo.rj_so_info && tripInfo.rj_so_info?.length > 0 && (
                        <>
                          {/* ================== RJSO Bata Amount Start ======================= */}
                          {tripsettlementData.rjso_bata_amount &&
                            tripsettlementData.rjso_bata_amount != '0' && (
                              <CTableRow>
                                <CTableDataCell>RJ Bata Amount</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    size="sm"
                                    value={tripsettlementData.rjso_bata_amount}
                                    readOnly
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          {/* ================== RJSO Bata Amount Part End ======================= */}
                          {/* ================== RJSO Loading Charges Part Start ======================= */}
                          {tripsettlementData.rjso_loading_charges &&
                            tripsettlementData.rjso_loading_charges != '0' && (
                              <CTableRow>
                                <CTableDataCell>RJ Loading Charges</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    size="sm"
                                    value={tripsettlementData.rjso_loading_charges}
                                    readOnly
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          {/* ================== RJSO Loading Charges Part End ======================= */}
                          {/* ================== RJSO Commision Charges Start ======================= */}
                          {tripsettlementData.rjso_commision_charges &&
                            tripsettlementData.rjso_commision_charges != '0' && (
                              <CTableRow>
                                <CTableDataCell>RJ Commision Charges</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    size="sm"
                                    value={tripsettlementData.rjso_commision_charges}
                                    readOnly
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          {/* ================== RJSO Commision Charges End ======================= */}
                          {/* ================== RJSO Tarpaulin Charges Start ======================= */}
                          {tripsettlementData.rjso_tarpaulin_charges &&
                            tripsettlementData.rjso_tarpaulin_charges != '0' && (
                              <CTableRow>
                                <CTableDataCell>RJ Tarpaulin Charges</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    size="sm"
                                    value={tripsettlementData.rjso_tarpaulin_charges}
                                    readOnly
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          {/* ================== RJSO Tarpaulin Charges End ======================= */}
                          {/* ================== RJSO Weighment Charges Start ======================= */}
                          {tripsettlementData.rjso_weighment_charges &&
                            tripsettlementData.rjso_weighment_charges != '0' && (
                              <CTableRow>
                                <CTableDataCell>RJ Weighment Charges</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    size="sm"
                                    value={tripsettlementData.rjso_weighment_charges}
                                    readOnly
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          {/* ================== RJSO Weighment Charges End ======================= */}
                          {/* ================== RJSO Unloading Charges Part Start ======================= */}
                          {tripsettlementData.rjso_unloading_charges &&
                            tripsettlementData.rjso_unloading_charges != '0' && (
                              <CTableRow>
                                <CTableDataCell>RJ Unloading Charges</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    size="sm"
                                    value={tripsettlementData.rjso_unloading_charges}
                                    readOnly
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          {/* ================== RJSO Unloading Charges Part End ======================= */}
                          {/* ================== RJSO Misc Charges Part Start ======================= */}
                          {tripsettlementData.rjso_misc_charges &&
                            tripsettlementData.rjso_misc_charges != '0' && (
                              <CTableRow>
                                <CTableDataCell>RJ Misc. Charges</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    size="sm"
                                    value={tripsettlementData.rjso_misc_charges}
                                    readOnly
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          {/* ================== RJSO Misc Charges Part End ======================= */}
                          {/* ================== RJSO Municipal Charges Part Start ======================= */}
                          {tripsettlementData.rjso_munic_charges &&
                            tripsettlementData.rjso_munic_charges != '0' && (
                              <CTableRow>
                                <CTableDataCell>RJ Municipal Charges</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    size="sm"
                                    value={tripsettlementData.rjso_munic_charges}
                                    readOnly
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          {/* ================== RJSO Municipal Charges Part End ======================= */}
                          {/* ================== RJSO Halt Charges Part Start ======================= */}
                          {tripsettlementData.rjso_halt_charges &&
                            tripsettlementData.rjso_halt_charges != '0' && (
                              <CTableRow>
                                <CTableDataCell>RJ Halt Charges</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    size="sm"
                                    value={tripsettlementData.rjso_halt_charges}
                                    readOnly
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          {/* ================== RJSO Halt Charges Part End ======================= */}
                          {/* ================== RJSO Enroute Diesel Charges Part Start ======================= */}
                          {tripsettlementData.rjso_en_diesel_charges &&
                            tripsettlementData.rjso_en_diesel_charges != '0' && (
                              <CTableRow>
                                <CTableDataCell>RJ Enroute Diesel Charges</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    size="sm"
                                    value={tripsettlementData.rjso_en_diesel_charges}
                                    readOnly
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          {/* ================== RJSO Enroute Diesel Charges Part End ======================= */}
                        </>
                      )}
                      {/* ==================== RJSO Additional Expenses Part End ==================== */}
                      {/* ==================== FCI Expenses Part Start ==================== */}
                      {tripInfo && tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id === 1 && tripStoData && tripStoData.length > 0 && (
                        <>
                         {/* ================== FCI Atti Cooli Amount Start ======================= */}
                         {tripsettlementData.fci_atti_cooli_charges &&
                            tripsettlementData.fci_atti_cooli_charges != '0' && (
                              <CTableRow>
                                <CTableDataCell>FCI Atti Cooli Amount</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    size="sm"
                                    value={tripsettlementData.fci_atti_cooli_charges}
                                    readOnly
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          {/* ==================  FCI Atti Cooli Amount Part End ======================= */}
                          {/* ================== FCI Extra Amount Start ======================= */}
                          {tripsettlementData.fci_extra_charges &&
                            tripsettlementData.fci_extra_charges != '0' && (
                              <CTableRow>
                                <CTableDataCell>FCI Additional Amount</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    size="sm"
                                    value={tripsettlementData.fci_extra_charges}
                                    readOnly
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          {/* ==================  FCI Extra Amount Part End ======================= */}
                          {/* ================== FCI Office Expense Amount Start ======================= */}
                          {tripsettlementData.fci_office_exp_charges &&
                            tripsettlementData.fci_office_exp_charges != '0' && (
                              <CTableRow>
                                <CTableDataCell>FCI Office Expense Amount</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    size="sm"
                                    value={tripsettlementData.fci_office_exp_charges}
                                    readOnly
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          {/* ==================  FCI Office Expense Amount Part End ======================= */}
                          {/* ================== FCI Gate Expense Amount Start ======================= */}
                          {tripsettlementData.fci_gate_exp_charges &&
                            tripsettlementData.fci_gate_exp_charges != '0' && (
                              <CTableRow>
                                <CTableDataCell>FCI Gate Expense Amount</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    size="sm"
                                    value={tripsettlementData.fci_gate_exp_charges}
                                    readOnly
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          {/* ==================  FCI Gate Expense Amount Part End ======================= */}
                          {/* ================== FCI Weighment Amount Start ======================= */}
                          {tripsettlementData.fci_weighment_charges &&
                            tripsettlementData.fci_weighment_charges != '0' && (
                              <CTableRow>
                                <CTableDataCell>FCI Weighment Amount</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    size="sm"
                                    value={tripsettlementData.fci_weighment_charges}
                                    readOnly
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          {/* ==================  FCI Weighment Amount Part End ======================= */}
                        </>
                      )}
                      {/* ==================== FCI Expenses Part End ==================== */}
                        {/* ================== Total Charges Part Start ============ */}

                        <CTableRow>
                          <CTableDataCell>Total Expense Charges</CTableDataCell>
                          <CTableDataCell>
                            {tripsettlementData.registered_diesel_amount == 0 &&
                              tdaDieselInfo &&
                              tdaDieselInfo != '0' && (
                                <CFormInput
                                  size="sm"
                                  value={Number(tripsettlementData.expense) + Number(rvTotalValues.rvTotalDieselAmount)}
                                  readOnly
                                />
                              )}
                            {tripsettlementData.registered_diesel_amount > 0 && (
                              <CFormInput size="sm" value={tripsettlementData.expense} readOnly />
                            )}
                          </CTableDataCell>
                        </CTableRow>

                        {/* ================== Total Charges Part End ========== */}
                      </CTableBody>
                      {/* ================== Expense Table Body Part Start ======================= */}
                    </CTable>

                    <CTable caption="top" hover style={{ height: '30vh' }}>
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
                            Type
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
                          <CTableDataCell>Halt Days</CTableDataCell>
                          <CTableDataCell>
                            <CFormInput size="sm" value={tripsettlementData.halt_days} readOnly />
                          </CTableDataCell>
                        </CTableRow>
                        {tripsettlementData.fasttag_sap_document_no && tripsettlementData.fasttag_sap_document_no != '0' && (
                          <CTableRow>
                            <CTableDataCell>Fast-Tag SAP Document No.</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput size="sm" value={tripsettlementData.fasttag_sap_document_no} readOnly />
                            </CTableDataCell>
                          </CTableRow>
                        )}
                        {tripsettlementData.expense_sap_document_no && (
                          <CTableRow>
                            <CTableDataCell>SAP Expense Document Number</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                size="sm"
                                value={tripsettlementData.expense_sap_document_no}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                        )}
                        {tripsettlementData.expense_posting_date && (
                          <CTableRow>
                            <CTableDataCell>SAP Expense Posting Date</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                size="sm"
                                value={tripsettlementData.expense_posting_date}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                        )}

                        {tripsettlementData.income_rj_sap_document_no && (
                          <CTableRow>
                            <CTableDataCell>SAP RJ Document Number</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                size="sm"
                                value={tripsettlementData.income_rj_sap_document_no}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                        )}

                        {/* ================== Others Halt Days Part End ======================= */}
                      </CTableBody>
                      {/* ================== Expense Table Body Part End ======================= */}
                    </CTable>
                  </CTabPane>
                  {/* Own Vehicles Expenses Capture End */}
                  {/* Own Vehicles Income Capture Start */}
                  <CTabPane
                    role="tabpanel"
                    aria-labelledby="profile-tab"
                    visible={activeKey_2 === 13}
                  >
                    <CTable caption="top" hover style={{ height: '80vh' }}>
                      <CTableCaption style={{ color: 'maroon' }}>Income</CTableCaption>

                      {/* ================== Expense Table Header Part Start ====================== */}
                      <CTableHead
                        style={{
                          backgroundColor: '#4d3227',
                          color: 'white',
                        }}
                      >
                        <CTableRow>
                          {/* <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            S.No
                          </CTableHeaderCell> */}

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Division
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Journey Type
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Document No
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Base Freight
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Updated Base Freight
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Halting Charges
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Sub Delivery Charges
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Unloading Charges
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Weighment Charges
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Low Tonage Charges
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Toll Charges
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Other Freight
                          </CTableHeaderCell>

                          <CTableHeaderCell scope="col" style={{ color: 'white' }}>
                            Total Freight
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      {/* ================== Expense Table Header Part End ======================= */}
                      {/* ================== Expense Table Body Part Start ======================= */}
                      <CTableBody>
                        {/* ================== Income Body Start ======================= */}

                        {/* {tripFgsalesData.length > 0 &&
                          tripFgsalesData.map((data_fgsales, index_fgsales) => { */}
                        {shipmentInfo.length > 0 &&
                          shipmentInfo.map((data_fgsales, index_fgsales) => {
                            return (
                              <>
                                <CTableRow
                                  key={`fgsales_income_data${index_fgsales}`}
                                  style={{ background: 'honeydew' }}
                                >
                                  {/* <CTableDataCell>1</CTableDataCell> */}
                                  <CTableDataCell>
                                    {/* {data_fgsales.assigned_by == '2' ? 'NLCD' : 'NLFD'} */}
                                    {divisionFinder(data_fgsales)}
                                  </CTableDataCell>
                                  <CTableDataCell>FG-Sales</CTableDataCell>
                                  <CTableDataCell>{data_fgsales.shipment_no}</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      maxLength={5}
                                      value={data_fgsales.shipment_freight_amount}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeVadTableItemForIncome(
                                          e,
                                          'income_base_charges',
                                          index_fgsales
                                        )
                                      }}
                                      value={vadDataUpdateforIncome(
                                        data_fgsales.income_base_charges,
                                        data_fgsales.income_base_charges_input
                                      )}
                                      readOnly={incomeEdit(data_fgsales.assigned_by)}
                                      maxLength={6}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeVadTableItemForIncome(
                                          e,
                                          'income_halting_charges',
                                          index_fgsales
                                        )
                                      }}
                                      value={vadDataUpdateforIncome(
                                        data_fgsales.income_halting_charges,
                                        data_fgsales.income_halting_charges_input
                                      )}
                                      readOnly={incomeEdit(data_fgsales.assigned_by)}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeVadTableItemForIncome(
                                          e,
                                          'income_sub_delivery_charges',
                                          index_fgsales
                                        )
                                      }}
                                      value={vadDataUpdateforIncome(
                                        data_fgsales.income_sub_delivery_charges,
                                        data_fgsales.income_sub_delivery_charges_input
                                      )}
                                      readOnly={incomeEdit(data_fgsales.assigned_by)}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeVadTableItemForIncome(
                                          e,
                                          'income_unloading_charges',
                                          index_fgsales
                                        )
                                      }}
                                      value={vadDataUpdateforIncome(
                                        data_fgsales.income_unloading_charges,
                                        data_fgsales.income_unloading_charges_input
                                      )}
                                      readOnly={incomeEdit(data_fgsales.assigned_by)}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>

                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeVadTableItemForIncome(
                                          e,
                                          'income_weighment_chares',
                                          index_fgsales
                                        )
                                      }}
                                      value={vadDataUpdateforIncome(
                                        data_fgsales.income_weighment_chares,
                                        data_fgsales.income_weighment_chares_input
                                      )}
                                      readOnly={incomeEdit(data_fgsales.assigned_by)}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeVadTableItemForIncome(
                                          e,
                                          'income_low_tonage_charges',
                                          index_fgsales
                                        )
                                      }}
                                      value={vadDataUpdateforIncome(
                                        data_fgsales.income_low_tonage_charges,
                                        data_fgsales.income_low_tonage_charges_input
                                      )}
                                      readOnly={incomeEdit(data_fgsales.assigned_by)}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeVadTableItemForIncome(
                                          e,
                                          'income_toll_charges',
                                          index_fgsales
                                        )
                                      }}
                                      value={vadDataUpdateforIncome(
                                        data_fgsales.income_toll_charges,
                                        data_fgsales.income_toll_charges_input
                                      )}
                                      readOnly={incomeEdit(data_fgsales.assigned_by)}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeVadTableItemForIncome(
                                          e,
                                          'income_others_charges',
                                          index_fgsales
                                        )
                                      }}
                                      value={vadDataUpdateforIncome(
                                        data_fgsales.income_others_charges,
                                        data_fgsales.income_others_charges_input
                                      )}
                                      readOnly={incomeEdit(data_fgsales.assigned_by)}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>

                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      id={`shipment_own_fgsales_freight_${index_fgsales}`}
                                      maxLength={5}
                                      defaultValue={total_freight_calculation(
                                        'fg-sales',
                                        data_fgsales
                                      )}
                                      // defaultValue={data_fgsales.shipment_freight_amount}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </CTableRow>
                              </>
                            )
                          })
                        }

                        {/* {tripRjsoData.length > 0 &&
                          tripRjsoData.map((data_rjso, index_rjso) => { */}
                        {rjsoInfo.length > 0 &&
                          rjsoInfo.map((data_rjso, index_rjso) => {
                            return (
                              <>
                                <CTableRow
                                  key={`rjso_income_data${index_rjso}`}
                                  style={{ background: 'cornsilk' }}
                                >
                                  {/* <CTableDataCell>1</CTableDataCell> */}
                                  <CTableDataCell>Return Journey</CTableDataCell>
                                  <CTableDataCell>RJSO</CTableDataCell>
                                  <CTableDataCell>{data_rjso.rj_so_no}</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      maxLength={5}
                                      value={data_rjso.freight_income}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeRjsoTableItemForIncome(
                                          e,
                                          'income_base_charges',
                                          index_rjso
                                        )
                                      }}
                                      value={rjsoDataUpdateforIncome(
                                        data_rjso.income_base_charges,
                                        data_rjso.income_base_charges_input
                                      )}
                                      readOnly
                                      maxLength={6}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeRjsoTableItemForIncome(
                                          e,
                                          'income_halting_charges',
                                          index_rjso
                                        )
                                      }}
                                      value={rjsoDataUpdateforIncome(
                                        data_rjso.income_halting_charges,
                                        data_rjso.income_halting_charges_input
                                      )}
                                      readOnly={data_rjso.rj_invoice_no ? true : false}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeRjsoTableItemForIncome(
                                          e,
                                          'income_sub_delivery_charges',
                                          index_rjso
                                        )
                                      }}
                                      value={rjsoDataUpdateforIncome(
                                        data_rjso.income_sub_delivery_charges,
                                        data_rjso.income_sub_delivery_charges_input
                                      )}
                                      readOnly={data_rjso.rj_invoice_no ? true : false}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeRjsoTableItemForIncome(
                                          e,
                                          'income_unloading_charges',
                                          index_rjso
                                        )
                                      }}
                                      value={rjsoDataUpdateforIncome(
                                        data_rjso.income_unloading_charges,
                                        data_rjso.income_unloading_charges_input
                                      )}
                                      readOnly={data_rjso.rj_invoice_no ? true : false}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>

                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeRjsoTableItemForIncome(
                                          e,
                                          'income_weighment_chares',
                                          index_rjso
                                        )
                                      }}
                                      value={rjsoDataUpdateforIncome(
                                        data_rjso.income_weighment_chares,
                                        data_rjso.income_weighment_chares_input
                                      )}
                                      readOnly={data_rjso.rj_invoice_no ? true : false}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeRjsoTableItemForIncome(
                                          e,
                                          'income_low_tonage_charges',
                                          index_rjso
                                        )
                                      }}
                                      value={rjsoDataUpdateforIncome(
                                        data_rjso.income_low_tonage_charges,
                                        data_rjso.income_low_tonage_charges_input
                                      )}
                                      readOnly={data_rjso.rj_invoice_no ? true : false}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeRjsoTableItemForIncome(
                                          e,
                                          'income_toll_charges',
                                          index_rjso
                                        )
                                      }}
                                      value={rjsoDataUpdateforIncome(
                                        data_rjso.income_toll_charges,
                                        data_rjso.income_toll_charges_input
                                      )}
                                      readOnly={data_rjso.rj_invoice_no ? true : false}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeRjsoTableItemForIncome(
                                          e,
                                          'income_others_charges',
                                          index_rjso
                                        )
                                      }}
                                      readOnly={data_rjso.rj_invoice_no ? true : false}
                                      value={rjsoDataUpdateforIncome(
                                        data_rjso.income_others_charges,
                                        data_rjso.income_others_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>

                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      id={`trip_rjso_freight_${index_rjso}`}
                                      maxLength={5}
                                      defaultValue={total_freight_calculation('rjso', data_rjso)}
                                      // defaultValue={data_fgsales.shipment_freight_amount}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </CTableRow>
                              </>
                            )
                          })
                        }

                        {tripStoData.length > 0 &&
                          tripStoData.map((data_sto, index_sto) => {
                            return (
                              <>
                                <CTableRow
                                  key={`sto_income_data${index_sto}`}
                                  style={{ background: 'bisque' }}
                                >
                                  {/* <CTableDataCell>1</CTableDataCell> */}
                                  <CTableDataCell>
                                    {/* {data_sto.sto_delivery_division == 'CONSUMER' ? 'NLCD' : 'NLFD'} */}
                                    {stoDivisionFinder(data_sto)}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    {/* {data_sto.sto_delivery_type == '1' ? 'FG-Sto' : 'RM-Sto'} */}
                                    {stoJourneyTypeFinder(data_sto)}
                                  </CTableDataCell>
                                  {/* <CTableDataCell>{data_sto.sto_delivery_no}</CTableDataCell> */}
                                  <CTableDataCell>{data_sto.sto_delivery_no && data_sto.sto_delivery_no != '' ? data_sto.sto_delivery_no : data_sto.rake_migo_no}</CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      maxLength={5}
                                      value={data_sto.freight_amount}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeStoTableItemForIncome(
                                          e,
                                          'income_base_charges',
                                          index_sto
                                        )
                                      }}
                                      value={stoDataUpdateforIncome(
                                        data_sto.income_base_charges,
                                        data_sto.income_base_charges_input
                                      )}
                                      readOnly={incomeSTOEdit(data_sto.sto_delivery_division)}
                                      maxLength={6}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeStoTableItemForIncome(
                                          e,
                                          'income_halting_charges',
                                          index_sto
                                        )
                                      }}
                                      value={stoDataUpdateforIncome(
                                        data_sto.income_halting_charges,
                                        data_sto.income_halting_charges_input
                                      )}
                                      readOnly={incomeSTOEdit(data_sto.sto_delivery_division)}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeStoTableItemForIncome(
                                          e,
                                          'income_sub_delivery_charges',
                                          index_sto
                                        )
                                      }}
                                      value={stoDataUpdateforIncome(
                                        data_sto.income_sub_delivery_charges,
                                        data_sto.income_sub_delivery_charges_input
                                      )}
                                      readOnly={incomeSTOEdit(data_sto.sto_delivery_division)}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>

                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeStoTableItemForIncome(
                                          e,
                                          'income_unloading_charges',
                                          index_sto
                                        )
                                      }}
                                      value={stoDataUpdateforIncome(
                                        data_sto.income_unloading_charges,
                                        data_sto.income_unloading_charges_input
                                      )}
                                      readOnly={incomeSTOEdit(data_sto.sto_delivery_division)}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>

                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeStoTableItemForIncome(
                                          e,
                                          'income_weighment_chares',
                                          index_sto
                                        )
                                      }}
                                      value={stoDataUpdateforIncome(
                                        data_sto.income_weighment_chares,
                                        data_sto.income_weighment_chares_input
                                      )}
                                      readOnly={incomeSTOEdit(data_sto.sto_delivery_division)}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeStoTableItemForIncome(
                                          e,
                                          'income_low_tonage_charges',
                                          index_sto
                                        )
                                      }}
                                      value={stoDataUpdateforIncome(
                                        data_sto.income_low_tonage_charges,
                                        data_sto.income_low_tonage_charges_input
                                      )}
                                      readOnly={incomeSTOEdit(data_sto.sto_delivery_division)}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeStoTableItemForIncome(
                                          e,
                                          'income_toll_charges',
                                          index_sto
                                        )
                                      }}
                                      value={stoDataUpdateforIncome(
                                        data_sto.income_toll_charges,
                                        data_sto.income_toll_charges_input
                                      )}
                                      readOnly={incomeSTOEdit(data_sto.sto_delivery_division)}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeStoTableItemForIncome(
                                          e,
                                          'income_others_charges',
                                          index_sto
                                        )
                                      }}
                                      value={stoDataUpdateforIncome(
                                        data_sto.income_others_charges,
                                        data_sto.income_others_charges_input
                                      )}
                                      readOnly={incomeSTOEdit(data_sto.sto_delivery_division)}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>

                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      // id={`trip_sto_freight_${index_sto}`}
                                      id={
                                        data_sto.sto_delivery_type == '1'
                                          ? `trip_own_fgsto_freight_${index_sto}`
                                          : ( data_sto.sto_delivery_type == '4'
                                            ? `trip_own_fci_freight_${index_sto}` : `trip_own_rmsto_freight_${index_sto}`)
                                      }
                                      maxLength={5}
                                      defaultValue={total_freight_calculation('sto', data_sto)}
                                      // defaultValue={data_sto.freight_amount}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </CTableRow>
                              </>
                            )
                          })
                        }

                        {tripOthersStoData.length > 0 &&
                          tripOthersStoData.map((data_others_sto, index_others_sto) => {
                            return (
                              <>
                                <CTableRow key={`others_sto_income_data${index_others_sto}`}>
                                  {/* <CTableDataCell>1</CTableDataCell> */}
                                  <CTableDataCell>
                                  {vehicleRequestsData.length > 0 ? othersDivisionFinder(data_others_sto.others_vr_request_id) : '-'}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    {'OTHERS'}
                                  </CTableDataCell>
                                  <CTableDataCell>{data_others_sto.sto_delivery_no}</CTableDataCell>
                                  {/* <CTableDataCell>{data_sto.freight_amount}</CTableDataCell> */}
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      maxLength={5}
                                      value={data_others_sto.freight_amount}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeOthersStoTableItemForIncome(
                                          e,
                                          'income_base_charges',
                                          index_others_sto
                                        )
                                      }}
                                      value={othersStoDataUpdateforIncome(
                                        data_others_sto.income_base_charges,
                                        data_others_sto.income_base_charges_input
                                      )}
                                      maxLength={6}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeOthersStoTableItemForIncome(
                                          e,
                                          'income_halting_charges',
                                          index_others_sto
                                        )
                                      }}
                                      value={othersStoDataUpdateforIncome(
                                        data_others_sto.income_halting_charges,
                                        data_others_sto.income_halting_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeOthersStoTableItemForIncome(
                                          e,
                                          'income_sub_delivery_charges',
                                          index_others_sto
                                        )
                                      }}
                                      value={othersStoDataUpdateforIncome(
                                        data_others_sto.income_sub_delivery_charges,
                                        data_others_sto.income_sub_delivery_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeOthersStoTableItemForIncome(
                                          e,
                                          'income_unloading_charges',
                                          index_others_sto
                                        )
                                      }}
                                      value={othersStoDataUpdateforIncome(
                                        data_others_sto.income_unloading_charges,
                                        data_others_sto.income_unloading_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>

                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeOthersStoTableItemForIncome(
                                          e,
                                          'income_weighment_chares',
                                          index_others_sto
                                        )
                                      }}
                                      value={othersStoDataUpdateforIncome(
                                        data_others_sto.income_weighment_chares,
                                        data_others_sto.income_weighment_chares_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeOthersStoTableItemForIncome(
                                          e,
                                          'income_low_tonage_charges',
                                          index_others_sto
                                        )
                                      }}
                                      value={othersStoDataUpdateforIncome(
                                        data_others_sto.income_low_tonage_charges,
                                        data_others_sto.income_low_tonage_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeOthersStoTableItemForIncome(
                                          e,
                                          'income_toll_charges',
                                          index_others_sto
                                        )
                                      }}
                                      value={othersStoDataUpdateforIncome(
                                        data_others_sto.income_toll_charges,
                                        data_others_sto.income_toll_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        changeOthersStoTableItemForIncome(
                                          e,
                                          'income_others_charges',
                                          index_others_sto
                                        )
                                      }}
                                      value={othersStoDataUpdateforIncome(
                                        data_others_sto.income_others_charges,
                                        data_others_sto.income_others_charges_input
                                      )}
                                      maxLength={5}
                                    />
                                  </CTableDataCell>

                                  <CTableDataCell>
                                    <CFormInput
                                      size="sm"
                                      id={`trip_others_own_sto_freight_${index_others_sto}`}
                                      maxLength={5}
                                      defaultValue={total_freight_calculation('others', data_others_sto)}
                                      // defaultValue={data_others_sto.freight_amount}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                </CTableRow>
                              </>
                            )
                          })
                        }

                        {/* ================== Income Body End ======================= */}
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
                                  value={totalTripIncome}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>

                            <CTableRow>
                              <CTableHeaderCell scope="row">2</CTableHeaderCell>
                              <CTableDataCell>Expense</CTableDataCell>

                              <CTableDataCell>
                                {tripsettlementData.registered_diesel_amount == 0 && tdaDieselInfo && tdaDieselInfo != '0' && (
                                  <CFormInput
                                    size="sm"
                                    id="inputAddress"
                                    value={
                                      Number(tripsettlementData.expense)
                                      + Number(rvTotalValues.rvTotalDieselAmount)
                                    }
                                    readOnly
                                  />)
                                }
                                {tripsettlementData.registered_diesel_amount > 0 && (
                                  <CFormInput
                                    size="sm"
                                    id="inputAddress"
                                    value={tripsettlementData.expense}
                                    readOnly
                                  />
                                )}
                                {/* <CFormInput
                                  size="sm"
                                  id="inputAddress"
                                  value={tripsettlementData.expense}
                                  readOnly
                                /> */}
                              </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="row">2</CTableHeaderCell>
                              <CTableDataCell>Profit and Loss</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  size="sm"
                                  id="inputAddress"
                                  value={totalTripPL}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                          </CTableBody>
                        </CTable>
                        {/* ================== P&L Body End ======================= */}

                        {/* ================== Expense Division Part Start ======================= */}
                        {/* <CTableRow>
                          <CTableDataCell scope="row">
                            <b>0</b>
                          </CTableDataCell>
                          <CTableDataCell>Division</CTableDataCell>
                          {shipmentInfo && shipmentInfo.length > 0 && (
                            <>
                              {shipmentInfo.map((data, index) => {
                                return (
                                  <CTableDataCell key={`fgsales_info_body_division_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      id={`fgsales_expense_division_${index}`}
                                      name={`fgsales_expense_division_${index}`}
                                      value={data.assigned_by == 1 ? 'NLFD' : 'NLCD'}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {rjsoInfo && rjsoInfo.length > 0 && (
                            <>
                              {rjsoInfo.map((data, index) => {
                                return (
                                  <CTableDataCell key={`rjso_info_body_division_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      id={`rjso_expense_division_${index}`}
                                      name={`rjso_expense_division_${index}`}
                                      value="NLFD"
                                      readOnly
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableData && stoTableData.length > 0 && (
                            <>
                              {stoTableData.map((data, index) => {
                                return (
                                  <CTableDataCell key={`fgsto_info_body_division_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      id={`sto_fgsto_expense_division_${index}`}
                                      name={`sto_fgsto_expense_division_${index}`}
                                      value="NLFD"
                                      readOnly
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableDataRMSTO && stoTableDataRMSTO.length > 0 && (
                            <>
                              {stoTableDataRMSTO.map((data, index) => {
                                return (
                                  <CTableDataCell key={`rmsto_info_body_division_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      id={`sto_rmsto_expense_division_${index}`}
                                      name={`sto_rmsto_expense_division_${index}`}
                                      value="NLFD"
                                      readOnly
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}
                          <CTableDataCell scope="row">
                            <CFormInput size="sm" value="*****" readOnly />
                          </CTableDataCell>
                        </CTableRow> */}

                        {/* ================== Expense Division Part End ======================= */}
                        {/* ================== Expense Toll Amount Start ======================= */}

                        {/* <CTableRow>
                          <CTableDataCell scope="row">
                            <b>1</b>
                          </CTableDataCell>
                          <CTableDataCell>Toll Amount</CTableDataCell>
                          {shipmentInfo && shipmentInfo.length > 0 && (
                            <>
                              {shipmentInfo.map((data, index) => {
                                return (
                                  <CTableDataCell key={`fgsales_info_body_toll_amount_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgsalesExpenseItem(e, 'toll_amount', index)
                                      }}
                                      maxLength={5}
                                      value={vadDataUpdateForExpenses(data.toll_amount)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {rjsoInfo && rjsoInfo.length > 0 && (
                            <>
                              {rjsoInfo.map((data, index) => {
                                return (
                                  <CTableDataCell key={`rjso_info_body_toll_amount_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRjsoExpenseItem(e, 'toll_amount', index)
                                      }}
                                      maxLength={5}
                                      value={rjsoDataUpdateForExpenses(data.toll_amount)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableData && stoTableData.length > 0 && (
                            <>
                              {stoTableData.map((data, index) => {
                                return (
                                  <CTableDataCell key={`fgsto_info_body_toll_amount_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgstoExpenseItem(e, 'toll_amount', index)
                                      }}
                                      maxLength={5}
                                      value={fgstoDataUpdateForExpenses(data.toll_amount)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableDataRMSTO && stoTableDataRMSTO.length > 0 && (
                            <>
                              {stoTableDataRMSTO.map((data, index) => {
                                return (
                                  <CTableDataCell key={`rmsto_info_body_toll_amount_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRmstoExpenseItem(e, 'toll_amount', index)
                                      }}
                                      maxLength={5}
                                      value={rmstoDataUpdateForExpenses(data.toll_amount)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}
                          <CTableDataCell scope="row">
                            <CFormInput
                              size="sm"
                              id="expense_row_total_toll_amount"
                              name="expense_row_total_toll_amount"
                              value={totalTollAmount ? totalTollAmount : 0}
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow> */}
                        {/* ================== Expense Toll Amount Part End ======================= */}
                        {/* ================== Expense Bata Part Start ======================= */}

                        {/* <CTableRow>
                          <CTableDataCell scope="row">
                            <b>2</b>
                          </CTableDataCell>
                          <CTableDataCell>Bata</CTableDataCell>
                          {shipmentInfo && shipmentInfo.length > 0 && (
                            <>
                              {shipmentInfo.map((data, index) => {
                                return (
                                  <CTableDataCell key={`fgsales_info_body_bata_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgsalesExpenseItem(e, 'bata', index)
                                      }}
                                      maxLength={5}
                                      value={vadDataUpdateForExpenses(data.bata)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {rjsoInfo && rjsoInfo.length > 0 && (
                            <>
                              {rjsoInfo.map((data, index) => {
                                return (
                                  <CTableDataCell key={`rjso_info_body_bata_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRjsoExpenseItem(e, 'bata', index)
                                      }}
                                      maxLength={5}
                                      value={rjsoDataUpdateForExpenses(data.bata)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableData && stoTableData.length > 0 && (
                            <>
                              {stoTableData.map((data, index) => {
                                return (
                                  <CTableDataCell key={`fgsto_info_body_bata_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgstoExpenseItem(e, 'bata', index)
                                      }}
                                      maxLength={5}
                                      value={fgstoDataUpdateForExpenses(data.bata)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableDataRMSTO && stoTableDataRMSTO.length > 0 && (
                            <>
                              {stoTableDataRMSTO.map((data, index) => {
                                return (
                                  <CTableDataCell key={`rmsto_info_body_bata_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRmstoExpenseItem(e, 'bata', index)
                                      }}
                                      maxLength={5}
                                      value={rmstoDataUpdateForExpenses(data.bata)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}
                          <CTableDataCell scope="row">
                            <CFormInput
                              size="sm"
                              id="expense_row_total_bata"
                              name="expense_row_total_bata"
                              value={totalBata ? totalBata : 0}
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow> */}
                        {/* ================== Expense Bata Part End ======================= */}
                        {/* ================== Municipal Charges Part Start ======================= */}

                        {/* <CTableRow>
                          <CTableDataCell scope="row">
                            <b>3</b>
                          </CTableDataCell>
                          <CTableDataCell>Municipal Charges</CTableDataCell>
                          {shipmentInfo && shipmentInfo.length > 0 && (
                            <>
                              {shipmentInfo.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`fgsales_info_body_municipal_charges_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgsalesExpenseItem(e, 'municipal_charges', index)
                                      }}
                                      maxLength={5}
                                      value={vadDataUpdateForExpenses(data.municipal_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {rjsoInfo && rjsoInfo.length > 0 && (
                            <>
                              {rjsoInfo.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`rjso_info_body_municipal_charges_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRjsoExpenseItem(e, 'municipal_charges', index)
                                      }}
                                      maxLength={5}
                                      value={rjsoDataUpdateForExpenses(data.municipal_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableData && stoTableData.length > 0 && (
                            <>
                              {stoTableData.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`fgsto_info_body_municipal_charges_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgstoExpenseItem(e, 'municipal_charges', index)
                                      }}
                                      maxLength={5}
                                      value={fgstoDataUpdateForExpenses(data.municipal_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableDataRMSTO && stoTableDataRMSTO.length > 0 && (
                            <>
                              {stoTableDataRMSTO.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`rmsto_info_body_municipal_charges_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRmstoExpenseItem(e, 'municipal_charges', index)
                                      }}
                                      maxLength={5}
                                      value={rmstoDataUpdateForExpenses(data.municipal_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}
                          <CTableDataCell scope="row">
                            <CFormInput
                              size="sm"
                              id="expense_row_total_municipal_charges"
                              name="expense_row_total_municipal_charges"
                              value={totalMunicipalCharges ? totalMunicipalCharges : 0}
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow> */}
                        {/* ================== Municipal Charges Part End ======================= */}
                        {/* ================== Registerd Diesel Amount Part Start ======================= */}

                        {/* <CTableRow>
                          <CTableDataCell scope="row">
                            <b>4</b>
                          </CTableDataCell>
                          <CTableDataCell>Registered Diesel Amount</CTableDataCell>
                          {shipmentInfo && shipmentInfo.length > 0 && (
                            <>
                              {shipmentInfo.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`fgsales_info_body_registered_diesel_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      id={`fgsales_expense_registered_diesel_${index}`}
                                      maxLength={5}
                                      name={`fgsales_expense_registered_diesel_${index}`}
                                      // value={data.diesel_amount_input}
                                      value="-"
                                      readOnly
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {rjsoInfo && rjsoInfo.length > 0 && (
                            <>
                              {rjsoInfo.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`rjso_info_body_registered_diesel_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      maxLength={5}
                                      id={`rjso_expense_registered_diesel_${index}`}
                                      name={`rjso_expense_registered_diesel_${index}`}
                                      // value={data.diesel_amount_input}
                                      value="-"
                                      readOnly
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableData && stoTableData.length > 0 && (
                            <>
                              {stoTableData.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`fgsto_info_body_registered_diesel_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      maxLength={5}
                                      id={`sto_fgsto_expense_registered_diesel_${index}`}
                                      name={`sto_fgsto_expense_registered_diesel_${index}`}
                                      // value={data.diesel_amount_input}
                                      value="-"
                                      readOnly
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableDataRMSTO && stoTableDataRMSTO.length > 0 && (
                            <>
                              {stoTableDataRMSTO.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`rmsto_info_body_registered_diesel_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      maxLength={5}
                                      id={`sto_rmsto_expense_registered_diesel_${index}`}
                                      name={`sto_rmsto_expense_registered_diesel_${index}`}
                                      value="-"
                                      readOnly
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}
                          <CTableDataCell scope="row">
                            <CFormInput
                              size="sm"
                              id="expense_row_total_registered_diesel"
                              name="expense_row_total_registered_diesel"
                              value={rvTotalValuesBP.rvTotalDieselAmount}
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow> */}
                        {/* ================== Registerd Diesel Amount Part End ======================= */}
                        {/* ================== Enroute Diesel Amount Part Start ======================= */}

                        {/* <CTableRow>
                          <CTableDataCell scope="row">
                            <b>5</b>
                          </CTableDataCell>
                          <CTableDataCell>Enroute Diesel Amount</CTableDataCell>
                          {shipmentInfo && shipmentInfo.length > 0 && (
                            <>
                              {shipmentInfo.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`fgsales_info_body_enroute_diesel_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      id={`fgsales_expense_enroute_diesel_${index}`}
                                      onChange={(e) => {
                                        onChangeExpenseItem(e)
                                      }}
                                      maxLength={5}
                                      name={`fgsales_expense_enroute_diesel_${index}`}
                                      // value={formExpensesData.fgsales_expense_enroute_diesel_1}
                                      value="-"
                                      readOnly
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {rjsoInfo && rjsoInfo.length > 0 && (
                            <>
                              {rjsoInfo.map((data, index) => {
                                return (
                                  <CTableDataCell key={`rjso_info_body_enroute_diesel_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeExpenseItem(e)
                                      }}
                                      maxLength={5}
                                      id={`rjso_expense_enroute_diesel_${index}`}
                                      name={`rjso_expense_enroute_diesel_${index}`}
                                      // value={formExpensesData.rjso_expense_enroute_diesel_1}
                                      value="-"
                                      readOnly
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableData && stoTableData.length > 0 && (
                            <>
                              {stoTableData.map((data, index) => {
                                return (
                                  <CTableDataCell key={`fgsto_info_body_enroute_diesel_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeExpenseItem(e)
                                      }}
                                      maxLength={5}
                                      id={`sto_fgsto_expense_enroute_diesel_${index}`}
                                      name={`sto_fgsto_expense_enroute_diesel_${index}`}
                                      // value={formExpensesData.sto_fgsto_expense_enroute_diesel_1}
                                      value="-"
                                      readOnly
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableDataRMSTO && stoTableDataRMSTO.length > 0 && (
                            <>
                              {stoTableDataRMSTO.map((data, index) => {
                                return (
                                  <CTableDataCell key={`rmsto_info_body_enroute_diesel_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeExpenseItem(e)
                                      }}
                                      maxLength={5}
                                      id={`sto_rmsto_expense_enroute_diesel_${index}`}
                                      name={`sto_rmsto_expense_enroute_diesel_${index}`}
                                      // value={formExpensesData.sto_rmsto_expense_enroute_diesel_1}
                                      value="-"
                                      readOnly
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}
                          <CTableDataCell scope="row">
                            <CFormInput
                              size="sm"
                              id="expense_row_total_enroute_diesel"
                              name="expense_row_total_enroute_diesel"
                              value={urvTotalAmountFinder}
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow> */}
                        {/* ================== Enroute Diesel Part End ======================= */}
                        {/* ================== Port Entry Fee Part Start ======================= */}

                        {/* <CTableRow>
                          <CTableDataCell scope="row">
                            <b>6</b>
                          </CTableDataCell>
                          <CTableDataCell>Port Entry Fee</CTableDataCell>
                          {shipmentInfo && shipmentInfo.length > 0 && (
                            <>
                              {shipmentInfo.map((data, index) => {
                                return (
                                  <CTableDataCell key={`fgsales_info_body_port_entry_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgsalesExpenseItem(e, 'port_entry_fee', index)
                                      }}
                                      maxLength={5}
                                      value={vadDataUpdateForExpenses(data.port_entry_fee)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {rjsoInfo && rjsoInfo.length > 0 && (
                            <>
                              {rjsoInfo.map((data, index) => {
                                return (
                                  <CTableDataCell key={`rjso_info_body_port_entry_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRjsoExpenseItem(e, 'port_entry_fee', index)
                                      }}
                                      maxLength={5}
                                      value={rjsoDataUpdateForExpenses(data.port_entry_fee)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableData && stoTableData.length > 0 && (
                            <>
                              {stoTableData.map((data, index) => {
                                return (
                                  <CTableDataCell key={`fgsto_info_body_port_entry_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgstoExpenseItem(e, 'port_entry_fee', index)
                                      }}
                                      maxLength={5}
                                      value={fgstoDataUpdateForExpenses(data.port_entry_fee)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableDataRMSTO && stoTableDataRMSTO.length > 0 && (
                            <>
                              {stoTableDataRMSTO.map((data, index) => {
                                return (
                                  <CTableDataCell key={`rmsto_info_body_port_entry_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRmstoExpenseItem(e, 'port_entry_fee', index)
                                      }}
                                      maxLength={5}
                                      value={rmstoDataUpdateForExpenses(data.port_entry_fee)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}
                          <CTableDataCell scope="row">
                            <CFormInput
                              size="sm"
                              id="expense_row_total_port_entry"
                              name="expense_row_total_port_entry"
                              value={totalPortEntryFee ? totalPortEntryFee : 0}
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow> */}
                        {/* ================== Port Entry Fee Part End ======================= */}
                        {/* ================== Misc Charges Part Start ======================= */}

                        {/* <CTableRow>
                          <CTableDataCell scope="row">
                            <b>7</b>
                          </CTableDataCell>
                          <CTableDataCell>Misc Charges</CTableDataCell>
                          {shipmentInfo && shipmentInfo.length > 0 && (
                            <>
                              {shipmentInfo.map((data, index) => {
                                return (
                                  <CTableDataCell key={`fgsales_info_body_misc_charge_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgsalesExpenseItem(e, 'misc_charges', index)
                                      }}
                                      maxLength={5}
                                      value={vadDataUpdateForExpenses(data.misc_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {rjsoInfo && rjsoInfo.length > 0 && (
                            <>
                              {rjsoInfo.map((data, index) => {
                                return (
                                  <CTableDataCell key={`rjso_info_body_misc_charge_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRjsoExpenseItem(e, 'misc_charges', index)
                                      }}
                                      maxLength={5}
                                      value={rjsoDataUpdateForExpenses(data.misc_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableData && stoTableData.length > 0 && (
                            <>
                              {stoTableData.map((data, index) => {
                                return (
                                  <CTableDataCell key={`fgsto_info_body_misc_charge_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgstoExpenseItem(e, 'misc_charges', index)
                                      }}
                                      maxLength={5}
                                      value={fgstoDataUpdateForExpenses(data.misc_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableDataRMSTO && stoTableDataRMSTO.length > 0 && (
                            <>
                              {stoTableDataRMSTO.map((data, index) => {
                                return (
                                  <CTableDataCell key={`rmsto_info_body_misc_charge_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRmstoExpenseItem(e, 'misc_charges', index)
                                      }}
                                      maxLength={5}
                                      value={rmstoDataUpdateForExpenses(data.misc_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}
                          <CTableDataCell scope="row">
                            <CFormInput
                              size="sm"
                              id="expense_row_total_misc_charge"
                              name="expense_row_total_misc_charge"
                              value={totalMiscCharges ? totalMiscCharges : 0}
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow> */}
                        {/* ================== Misc Charges Part End ======================= */}
                        {/* ================== Fine Amount Part Start ======================= */}

                        {/* <CTableRow>
                          <CTableDataCell scope="row">
                            <b>8</b>
                          </CTableDataCell>
                          <CTableDataCell>Fine Amount</CTableDataCell>
                          {shipmentInfo && shipmentInfo.length > 0 && (
                            <>
                              {shipmentInfo.map((data, index) => {
                                return (
                                  <CTableDataCell key={`fgsales_info_body_fine_charge_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgsalesExpenseItem(e, 'fine_amount', index)
                                      }}
                                      maxLength={5}
                                      value={vadDataUpdateForExpenses(data.fine_amount)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {rjsoInfo && rjsoInfo.length > 0 && (
                            <>
                              {rjsoInfo.map((data, index) => {
                                return (
                                  <CTableDataCell key={`rjso_info_body_fine_charge_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRjsoExpenseItem(e, 'fine_amount', index)
                                      }}
                                      maxLength={5}
                                      value={rjsoDataUpdateForExpenses(data.fine_amount)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableData && stoTableData.length > 0 && (
                            <>
                              {stoTableData.map((data, index) => {
                                return (
                                  <CTableDataCell key={`fgsto_info_body_fine_charge_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgstoExpenseItem(e, 'fine_amount', index)
                                      }}
                                      maxLength={5}
                                      value={fgstoDataUpdateForExpenses(data.fine_amount)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableDataRMSTO && stoTableDataRMSTO.length > 0 && (
                            <>
                              {stoTableDataRMSTO.map((data, index) => {
                                return (
                                  <CTableDataCell key={`rmsto_info_body_fine_charge_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRmstoExpenseItem(e, 'fine_amount', index)
                                      }}
                                      maxLength={5}
                                      value={rmstoDataUpdateForExpenses(data.fine_amount)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}
                          <CTableDataCell scope="row">
                            <CFormInput
                              size="sm"
                              id="expense_row_total_fine_charge"
                              name="expense_row_total_fine_charge"
                              value={totalFineAmount ? totalFineAmount : 0}
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow> */}
                        {/* ================== Fine Amount Part End ======================= */}
                        {/* ================== Subdelivery Charges Part Start ======================= */}

                        {/* <CTableRow>
                          <CTableDataCell scope="row">
                            <b>9</b>
                          </CTableDataCell>
                          <CTableDataCell>Subdelivery Charges</CTableDataCell>
                          {shipmentInfo && shipmentInfo.length > 0 && (
                            <>
                              {shipmentInfo.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`fgsales_info_body_subdelivery_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgsalesExpenseItem(e, 'sub_delivery_charges', index)
                                      }}
                                      maxLength={5}
                                      value={vadDataUpdateForExpenses(data.sub_delivery_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {rjsoInfo && rjsoInfo.length > 0 && (
                            <>
                              {rjsoInfo.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`rjso_info_body_subdelivery_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRjsoExpenseItem(e, 'sub_delivery_charges', index)
                                      }}
                                      maxLength={5}
                                      value={rjsoDataUpdateForExpenses(data.sub_delivery_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableData && stoTableData.length > 0 && (
                            <>
                              {stoTableData.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`fgsto_info_body_subdelivery_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgstoExpenseItem(e, 'sub_delivery_charges', index)
                                      }}
                                      maxLength={5}
                                      value={fgstoDataUpdateForExpenses(data.sub_delivery_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableDataRMSTO && stoTableDataRMSTO.length > 0 && (
                            <>
                              {stoTableDataRMSTO.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`rmsto_info_body_subdelivery_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRmstoExpenseItem(e, 'sub_delivery_charges', index)
                                      }}
                                      maxLength={5}
                                      value={rmstoDataUpdateForExpenses(data.sub_delivery_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}
                          <CTableDataCell scope="row">
                            <CFormInput
                              size="sm"
                              id="expense_row_total_subdelivery_charge"
                              name="expense_row_total_subdelivery_charge"
                              value={totalSubDeliveryCharges ? totalSubDeliveryCharges : 0}
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow> */}
                        {/* ================== Subdelivery Charges Part End ======================= */}
                        {/* ================== Maintenance Cost Part Start ======================= */}

                        {/* <CTableRow>
                          <CTableDataCell scope="row">
                            <b>10</b>
                          </CTableDataCell>
                          <CTableDataCell>Maintenance Cost</CTableDataCell>
                          {shipmentInfo && shipmentInfo.length > 0 && (
                            <>
                              {shipmentInfo.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`fgsales_info_body_maintenance_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgsalesExpenseItem(e, 'maintenance_cost', index)
                                      }}
                                      maxLength={5}
                                      value={vadDataUpdateForExpenses(data.maintenance_cost)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {rjsoInfo && rjsoInfo.length > 0 && (
                            <>
                              {rjsoInfo.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`rjso_info_body_maintenance_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRjsoExpenseItem(e, 'maintenance_cost', index)
                                      }}
                                      maxLength={5}
                                      value={rjsoDataUpdateForExpenses(data.maintenance_cost)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableData && stoTableData.length > 0 && (
                            <>
                              {stoTableData.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`fgsto_info_body_maintenance_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgstoExpenseItem(e, 'maintenance_cost', index)
                                      }}
                                      maxLength={5}
                                      value={fgstoDataUpdateForExpenses(data.maintenance_cost)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableDataRMSTO && stoTableDataRMSTO.length > 0 && (
                            <>
                              {stoTableDataRMSTO.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`rmsto_info_body_maintenance_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRmstoExpenseItem(e, 'maintenance_cost', index)
                                      }}
                                      maxLength={5}
                                      value={rmstoDataUpdateForExpenses(data.maintenance_cost)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}
                          <CTableDataCell scope="row">
                            <CFormInput
                              size="sm"
                              id="expense_row_total_maintenance_charge"
                              name="expense_row_total_maintenance_charge"
                              value={totalMaintenanceCost ? totalMaintenanceCost : 0}
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow> */}
                        {/* ================== Maintenance Cost Part End ======================= */}
                        {/* ================== Loading Charges Part Start ======================= */}

                        {/* <CTableRow>
                          <CTableDataCell scope="row">
                            <b>11</b>
                          </CTableDataCell>
                          <CTableDataCell>Loading Charges</CTableDataCell>
                          {shipmentInfo && shipmentInfo.length > 0 && (
                            <>
                              {shipmentInfo.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`fgsales_info_body_loading_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgsalesExpenseItem(e, 'loading_charges', index)
                                      }}
                                      maxLength={5}
                                      value={vadDataUpdateForExpenses(data.loading_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {rjsoInfo && rjsoInfo.length > 0 && (
                            <>
                              {rjsoInfo.map((data, index) => {
                                return (
                                  <CTableDataCell key={`rjso_info_body_loading_charge_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRjsoExpenseItem(e, 'loading_charges', index)
                                      }}
                                      maxLength={5}
                                      value={rjsoDataUpdateForExpenses(data.loading_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableData && stoTableData.length > 0 && (
                            <>
                              {stoTableData.map((data, index) => {
                                return (
                                  <CTableDataCell key={`fgsto_info_body_loading_charge_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgstoExpenseItem(e, 'loading_charges', index)
                                      }}
                                      maxLength={5}
                                      value={fgstoDataUpdateForExpenses(data.loading_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableDataRMSTO && stoTableDataRMSTO.length > 0 && (
                            <>
                              {stoTableDataRMSTO.map((data, index) => {
                                return (
                                  <CTableDataCell key={`rmsto_info_body_loading_charge_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRmstoExpenseItem(e, 'loading_charges', index)
                                      }}
                                      maxLength={5}
                                      value={rmstoDataUpdateForExpenses(data.loading_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}
                          <CTableDataCell scope="row">
                            <CFormInput
                              size="sm"
                              id="expense_row_total_loading_charge"
                              name="expense_row_total_loading_charge"
                              value={totalLoadingCharges ? totalLoadingCharges : 0}
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow> */}
                        {/* ================== Loading Charges Part End ======================= */}
                        {/* ================== Unloading Charges Part Start ======================= */}

                        {/* <CTableRow>
                          <CTableDataCell scope="row">
                            <b>12</b>
                          </CTableDataCell>
                          <CTableDataCell>Unloading Charges</CTableDataCell>
                          {shipmentInfo && shipmentInfo.length > 0 && (
                            <>
                              {shipmentInfo.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`fgsales_info_body_unloading_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgsalesExpenseItem(e, 'unloading_charges', index)
                                      }}
                                      maxLength={5}
                                      value={vadDataUpdateForExpenses(data.unloading_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {rjsoInfo && rjsoInfo.length > 0 && (
                            <>
                              {rjsoInfo.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`rjso_info_body_unloading_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRjsoExpenseItem(e, 'unloading_charges', index)
                                      }}
                                      maxLength={5}
                                      value={rjsoDataUpdateForExpenses(data.unloading_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableData && stoTableData.length > 0 && (
                            <>
                              {stoTableData.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`fgsto_info_body_unloading_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgstoExpenseItem(e, 'unloading_charges', index)
                                      }}
                                      maxLength={5}
                                      value={fgstoDataUpdateForExpenses(data.unloading_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableDataRMSTO && stoTableDataRMSTO.length > 0 && (
                            <>
                              {stoTableDataRMSTO.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`rmsto_info_body_unloading_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRmstoExpenseItem(e, 'unloading_charges', index)
                                      }}
                                      maxLength={5}
                                      value={rmstoDataUpdateForExpenses(data.unloading_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}
                          <CTableDataCell scope="row">
                            <CFormInput
                              size="sm"
                              id="expense_row_total_unloading_charge"
                              name="expense_row_total_unloading_charge"
                              value={totalUnloadingCharges ? totalUnloadingCharges : 0}
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow> */}
                        {/* ================== Unloading Charges Part End ======================= */}
                        {/* ================== Tarpaulin Charges Part Start ======================= */}

                        {/* <CTableRow>
                          <CTableDataCell scope="row">
                            <b>13</b>
                          </CTableDataCell>
                          <CTableDataCell>Tarpaulin Charges</CTableDataCell>
                          {shipmentInfo && shipmentInfo.length > 0 && (
                            <>
                              {shipmentInfo.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`fgsales_info_body_tarpaulin_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgsalesExpenseItem(e, 'tarpaulin_charges', index)
                                      }}
                                      maxLength={5}
                                      value={vadDataUpdateForExpenses(data.tarpaulin_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {rjsoInfo && rjsoInfo.length > 0 && (
                            <>
                              {rjsoInfo.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`rjso_info_body_tarpaulin_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRjsoExpenseItem(e, 'tarpaulin_charges', index)
                                      }}
                                      maxLength={5}
                                      value={rjsoDataUpdateForExpenses(data.tarpaulin_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableData && stoTableData.length > 0 && (
                            <>
                              {stoTableData.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`fgsto_info_body_tarpaulin_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgstoExpenseItem(e, 'tarpaulin_charges', index)
                                      }}
                                      maxLength={5}
                                      value={fgstoDataUpdateForExpenses(data.tarpaulin_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableDataRMSTO && stoTableDataRMSTO.length > 0 && (
                            <>
                              {stoTableDataRMSTO.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`rmsto_info_body_tarpaulin_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRmstoExpenseItem(e, 'tarpaulin_charges', index)
                                      }}
                                      maxLength={5}
                                      value={rmstoDataUpdateForExpenses(data.tarpaulin_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}
                          <CTableDataCell scope="row">
                            <CFormInput
                              size="sm"
                              id="expense_row_total_tarpaulin_charge"
                              name="expense_row_total_tarpaulin_charge"
                              value={totalTarpaulinCharges ? totalTarpaulinCharges : 0}
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow> */}
                        {/* ================== Tarpaulin Charges Part End ======================= */}
                        {/* ================== Weighment Charges Part Start ======================= */}

                        {/* <CTableRow>
                          <CTableDataCell scope="row">
                            <b>14</b>
                          </CTableDataCell>
                          <CTableDataCell>Weighment Charges</CTableDataCell>
                          {shipmentInfo && shipmentInfo.length > 0 && (
                            <>
                              {shipmentInfo.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`fgsales_info_body_weighment_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgsalesExpenseItem(e, 'weighment_charges', index)
                                      }}
                                      maxLength={5}
                                      value={vadDataUpdateForExpenses(data.weighment_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {rjsoInfo && rjsoInfo.length > 0 && (
                            <>
                              {rjsoInfo.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`rjso_info_body_weighment_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRjsoExpenseItem(e, 'weighment_charges', index)
                                      }}
                                      maxLength={5}
                                      value={rjsoDataUpdateForExpenses(data.weighment_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableData && stoTableData.length > 0 && (
                            <>
                              {stoTableData.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`fgsto_info_body_weighment_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgstoExpenseItem(e, 'weighment_charges', index)
                                      }}
                                      maxLength={5}
                                      value={fgstoDataUpdateForExpenses(data.weighment_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableDataRMSTO && stoTableDataRMSTO.length > 0 && (
                            <>
                              {stoTableDataRMSTO.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`rmsto_info_body_weighment_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRmstoExpenseItem(e, 'weighment_charges', index)
                                      }}
                                      maxLength={5}
                                      value={rmstoDataUpdateForExpenses(data.weighment_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}
                          <CTableDataCell scope="row">
                            <CFormInput
                              size="sm"
                              id="expense_row_total_weighment_charge"
                              name="expense_row_total_weighment_charge"
                              value={totalWeighmentCharges ? totalWeighmentCharges : 0}
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow> */}
                        {/* ================== Weighment Charges Part End ======================= */}
                        {/* ================== Low Tonage Charges Part Start ======================= */}

                        {/* <CTableRow>
                          <CTableDataCell scope="row">
                            <b>15</b>
                          </CTableDataCell>
                          <CTableDataCell>Low Tonage Charges</CTableDataCell>
                          {shipmentInfo && shipmentInfo.length > 0 && (
                            <>
                              {shipmentInfo.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`fgsales_info_body_unloading_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgsalesExpenseItem(e, 'low_tonage_charges', index)
                                      }}
                                      maxLength={5}
                                      value={vadDataUpdateForExpenses(data.low_tonage_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {rjsoInfo && rjsoInfo.length > 0 && (
                            <>
                              {rjsoInfo.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`rjso_info_body_low_tonage_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRjsoExpenseItem(e, 'low_tonage_charges', index)
                                      }}
                                      maxLength={5}
                                      value={rjsoDataUpdateForExpenses(data.low_tonage_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableData && stoTableData.length > 0 && (
                            <>
                              {stoTableData.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`fgsto_info_body_low_tonage_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgstoExpenseItem(e, 'low_tonage_charges', index)
                                      }}
                                      maxLength={5}
                                      value={fgstoDataUpdateForExpenses(data.low_tonage_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableDataRMSTO && stoTableDataRMSTO.length > 0 && (
                            <>
                              {stoTableDataRMSTO.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`rmsto_info_body_low_tonage_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRmstoExpenseItem(e, 'low_tonage_charges', index)
                                      }}
                                      maxLength={5}
                                      value={rmstoDataUpdateForExpenses(data.low_tonage_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}
                          <CTableDataCell scope="row">
                            <CFormInput
                              size="sm"
                              id="expense_row_total_low_tonage_charge"
                              name="expense_row_total_low_tonage_charge"
                              value={totalLowTonageCharges ? totalLowTonageCharges : 0}
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow> */}
                        {/* ================== Low Tonage Charges Part End ======================= */}
                        {/* ================== Stock Diversion / Return Charges Part Start ============ */}
                        {/*
                        <CTableRow>
                          <CTableDataCell scope="row">
                            <b>16</b>
                          </CTableDataCell>
                          <CTableDataCell>Stock Diversion / Return Charges</CTableDataCell>
                          {shipmentInfo && shipmentInfo.length > 0 && (
                            <>
                              {shipmentInfo.map((data, index) => {
                                return (
                                  <CTableDataCell key={`fgsales_info_body_stock_return_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgsalesExpenseItem(
                                          e,
                                          'diversion_return_charges',
                                          index
                                        )
                                      }}
                                      maxLength={5}
                                      value={vadDataUpdateForExpenses(data.diversion_return_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {rjsoInfo && rjsoInfo.length > 0 && (
                            <>
                              {rjsoInfo.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`rjso_info_body_stock_return_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRjsoExpenseItem(e, 'diversion_return_charges', index)
                                      }}
                                      maxLength={5}
                                      value={rjsoDataUpdateForExpenses(data.diversion_return_charges)}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableData && stoTableData.length > 0 && (
                            <>
                              {stoTableData.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`fgsto_info_body_stock_return_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeFgstoExpenseItem(e, 'diversion_return_charges', index)
                                      }}
                                      maxLength={5}
                                      value={fgstoDataUpdateForExpenses(
                                        data.diversion_return_charges
                                      )}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableDataRMSTO && stoTableDataRMSTO.length > 0 && (
                            <>
                              {stoTableDataRMSTO.map((data, index) => {
                                return (
                                  <CTableDataCell
                                    key={`rmsto_info_body_stock_return_charge_data${index}`}
                                  >
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeRmstoExpenseItem(e, 'diversion_return_charges', index)
                                      }}
                                      maxLength={5}
                                      value={rmstoDataUpdateForExpenses(
                                        data.diversion_return_charges
                                      )}
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}
                          <CTableDataCell scope="row">
                            <CFormInput
                              size="sm"
                              id="expense_row_total_stock_return_charge"
                              name="expense_row_total_stock_return_charge"
                              value={
                                totalStockDiversionReturnCharges
                                  ? totalStockDiversionReturnCharges
                                  : 0
                              }
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow> */}
                        {/* ================== Stock Diversion / Return Charges Part End ========== */}
                        {/* ================== Total Charges Part Start ============ */}

                        {/* <CTableRow>
                          <CTableDataCell scope="row">
                            <b>*</b>
                          </CTableDataCell>
                          <CTableDataCell>Total Charges</CTableDataCell>
                          {shipmentInfo && shipmentInfo.length > 0 && (
                            <>
                              {shipmentInfo.map((data, index) => {
                                return (
                                  <CTableDataCell key={`fgsales_info_body_stock_return_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      id={`fgsales_expense_total_charge_${index}`}
                                      onChange={(e) => {
                                        onChangeExpenseItem(e)
                                      }}
                                      maxLength={5}
                                      name={`fgsales_expense_total_charge_${index}`}
                                      value={formExpensesData.fgsales_expense_stock_return_charge_1}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {rjsoInfo && rjsoInfo.length > 0 && (
                            <>
                              {rjsoInfo.map((data, index) => {
                                return (
                                  <CTableDataCell key={`rjso_info_body_total_charge_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeExpenseItem(e)
                                      }}
                                      maxLength={5}
                                      id={`rjso_expense_total_charge_${index}`}
                                      name={`rjso_expense_total_charge_${index}`}
                                      value={formExpensesData.rjso_expense_stock_return_charge_1}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableData && stoTableData.length > 0 && (
                            <>
                              {stoTableData.map((data, index) => {
                                return (
                                  <CTableDataCell key={`fgsto_info_body_total_charge_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeExpenseItem(e)
                                      }}
                                      maxLength={5}
                                      id={`sto_fgsto_expense_total_charge_${index}`}
                                      name={`sto_fgsto_expense_total_charge_${index}`}
                                      value={formExpensesData.sto_fgsto_expense_stock_return_charge_1}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}

                          {stoTableDataRMSTO && stoTableDataRMSTO.length > 0 && (
                            <>
                              {stoTableDataRMSTO.map((data, index) => {
                                return (
                                  <CTableDataCell key={`rmsto_info_body_total_charge_data${index}`}>
                                    <CFormInput
                                      size="sm"
                                      onChange={(e) => {
                                        onChangeExpenseItem(e)
                                      }}
                                      maxLength={5}
                                      id={`sto_rmsto_expense_total_charge_${index}`}
                                      name={`sto_rmsto_expense_total_charge_${index}`}
                                      value={formExpensesData.sto_rmsto_expense_stock_return_charge_1}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                )
                              })}
                            </>
                          )}
                          <CTableDataCell scope="row">
                            <CFormInput
                              size="sm"
                              id="expense_row_total_total_charge"
                              name="expense_row_total_total_charge"
                              value={totalCharges ? totalCharges : 0}
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow> */}
                        {/* ================== Total Charges Part End ========== */}
                      </CTableBody>
                      {/* ================== Expense Table Body Part Start ======================= */}
                    </CTable>
                  </CTabPane>
                  {/* Own Vehicles Income Capture End */}
                  {/* Own Vehicles Advance Capture Start */}
                  <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey_2 === 7}>
                    <CTable caption="top" hover style={{ height: '50vh' }}>
                      <CTableHead
                        style={{ backgroundColor: '#4d3227', color: 'white', marginTop: '10px' }}
                      >
                        <CTableRow>
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
                        <CTableDataCell>Advance Amount</CTableDataCell>

                        <CTableDataCell>
                          <CFormInput
                            name="divortedPod"
                            size="sm"
                            id="formFileSm"
                            value={
                              tripInfo.advance_payment_info
                                ? tripInfo.advance_payment_info.advance_payment
                                : 0
                            }
                            readOnly
                          />
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Additional Advance Amount</CTableDataCell>

                        <CTableDataCell>
                          <CFormInput
                            name="divortedPod"
                            size="sm"
                            id="formFileSm"
                            value={
                              tripInfo.advance_payment_info
                                ? tripInfo.advance_payment_info.additional_advance_payment
                                : 0
                            }
                            readOnly
                          />
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Total Advance Amount</CTableDataCell>

                        <CTableDataCell>
                          <CFormInput
                            name="divortedPod"
                            size="sm"
                            id="formFileSm"
                            value={
                              tripInfo.advance_payment_info
                                ? Number(tripInfo.advance_payment_info.advance_payment) + Number(tripInfo.advance_payment_info.additional_advance_payment)
                                : 0
                            }
                            readOnly
                          />
                        </CTableDataCell>
                      </CTableRow>
                        {rjsoInfo.length > 0 && (
                          <>
                            <CTableRow>
                              <CTableDataCell>RJ Recipt Amount</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  name="divortedPod"
                                  size="sm"
                                  id="formFileSm"
                                  value={rj_receipt_amount_calculation()}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>

                            <CTableRow>
                              <CTableDataCell>Total Amount</CTableDataCell>
                              <CTableDataCell>
                                <CFormInput
                                  name="divortedPod"
                                  size="sm"
                                  id="formFileSm"
                                  value={total_amount_calculation()}
                                  readOnly
                                />
                              </CTableDataCell>
                            </CTableRow>
                          </>
                        )}
                        <CTableRow>
                          <CAccordion flush style={{ backgroundColor: 'white !important' }}>
                            <CAccordionItem
                              itemKey={3}
                              style={{ backgroundColor: 'white !important' }}
                            >
                              <CAccordionHeader style={{ backgroundColor: 'white !important' }}>
                                Driver Expense
                              </CAccordionHeader>

                              <CAccordionBody style={{ backgroundColor: 'white' }}>
                                {tripsettlementData.toll_amount && tripsettlementData.toll_amount != '0' && (
                                  <>
                                    <strong>Other Toll Charges - {tripsettlementData.toll_amount}</strong>
                                    <br />
                                  </>
                                )}
                                {tripsettlementData.bata && tripsettlementData.bata != '0' && (
                                  <>
                                    <strong>Driver Bata - {tripsettlementData.bata}</strong>
                                    <br />
                                  </>
                                )}
                                {tripsettlementData.loading_charges &&
                                  tripsettlementData.loading_charges != '0' && (
                                    <>
                                      <strong>
                                        Loading Charges - {tripsettlementData.loading_charges}
                                      </strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.unloading_charges &&
                                  tripsettlementData.unloading_charges != '0' && (
                                    <>
                                      <strong>
                                        Unloading Charges - {tripsettlementData.unloading_charges}
                                      </strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.sub_delivery_charges &&
                                  tripsettlementData.sub_delivery_charges != '0' && (
                                    <>
                                      <strong>
                                        Sub Delivery Charges -{' '}
                                        {tripsettlementData.sub_delivery_charges}
                                      </strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.weighment_charges &&
                                  tripsettlementData.weighment_charges != '0' && (
                                    <>
                                      <strong>
                                        Weighment Charges - {tripsettlementData.weighment_charges}
                                      </strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.diversion_return_charges &&
                                  tripsettlementData.diversion_return_charges != '0' && (
                                    <>
                                      <strong>
                                        Stock Diversion & Return Charges -{' '}
                                        {tripsettlementData.diversion_return_charges}
                                      </strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.municipal_charges &&
                                  tripsettlementData.municipal_charges != '0' && (
                                    <>
                                      <strong>
                                        Municipal Charges - {tripsettlementData.municipal_charges}
                                      </strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.enroute_diesel_amount != '0' && (
                                    <>
                                      <strong>
                                        Enroute Diesel Charges -{' '}
                                        {tripsettlementData.enroute_diesel_amount}
                                      </strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.port_entry_fee &&
                                  tripsettlementData.port_entry_fee != '0' && (
                                    <>
                                      <strong>
                                        Port Entry Charges - {tripsettlementData.port_entry_fee}
                                      </strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.misc_charges &&
                                  tripsettlementData.misc_charges != '0' && (
                                    <>
                                      <strong>
                                        Misc. Charges - {tripsettlementData.misc_charges}
                                      </strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.fine_amount &&
                                  tripsettlementData.fine_amount != '0' && (
                                    <>
                                      <strong>Fine Charges - {tripsettlementData.fine_amount}</strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.maintenance_cost &&
                                  tripsettlementData.maintenance_cost != '0' && (
                                    <>
                                      <strong>
                                        Maintenance Charges - {tripsettlementData.maintenance_cost}
                                      </strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.tarpaulin_charges &&
                                  tripsettlementData.tarpaulin_charges != '0' && (
                                    <>
                                      <strong>
                                        Tarpaulin Charges - {tripsettlementData.tarpaulin_charges}
                                      </strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.low_tonage_charges &&
                                  tripsettlementData.low_tonage_charges != '0' && (
                                    <>
                                      <strong>
                                        Low Tonage charges Charges -{' '}
                                        {tripsettlementData.low_tonage_charges}
                                      </strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.halting_charges &&
                                  tripsettlementData.halting_charges != '0' && (
                                    <>
                                      <strong>
                                        Halting Charges - {tripsettlementData.halting_charges}
                                      </strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.local_bata_amount &&
                                  tripsettlementData.local_bata_amount != '0' && (
                                    <>
                                      <strong>
                                        Local Bata - {tripsettlementData.local_bata_amount}
                                      </strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.halt_bata_amount &&
                                  tripsettlementData.halt_bata_amount != '0' && (
                                    <>
                                      <strong>
                                        Halt Bata - {tripsettlementData.halt_bata_amount}
                                      </strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.rjso_bata_amount &&
                                tripsettlementData.rjso_bata_amount != '0' && (
                                  <>
                                    <strong>
                                      RJ Bata Amount - {tripsettlementData.rjso_bata_amount}
                                    </strong>
                                    <br />
                                  </>
                                )}
                                {tripsettlementData.rjso_loading_charges &&
                                  tripsettlementData.rjso_loading_charges != '0' && (
                                    <>
                                      <strong>
                                        RJ Loading Charges - {tripsettlementData.rjso_loading_charges}
                                      </strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.rjso_commision_charges &&
                                  tripsettlementData.rjso_commision_charges != '0' && (
                                    <>
                                      <strong>
                                        RJ Commision Charges - {tripsettlementData.rjso_commision_charges}
                                      </strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.rjso_tarpaulin_charges &&
                                  tripsettlementData.rjso_tarpaulin_charges != '0' && (
                                    <>
                                      <strong>
                                        RJ Tarpaulin Charges - {tripsettlementData.rjso_tarpaulin_charges}
                                      </strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.rjso_weighment_charges &&
                                  tripsettlementData.rjso_weighment_charges != '0' && (
                                    <>
                                      <strong>
                                        RJ Weighment Charges - {tripsettlementData.rjso_weighment_charges}
                                      </strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.rjso_unloading_charges &&
                                  tripsettlementData.rjso_unloading_charges != '0' && (
                                    <>
                                      <strong>
                                        RJ Unloading Charges - {tripsettlementData.rjso_unloading_charges}
                                      </strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.rjso_misc_charges &&
                                  tripsettlementData.rjso_misc_charges != '0' && (
                                    <>
                                      <strong>
                                        RJ Misc. Charges - {tripsettlementData.rjso_misc_charges}
                                      </strong>
                                      <br />
                                    </>
                                  )}
                                {tripsettlementData.rjso_munic_charges &&
                                  tripsettlementData.rjso_munic_charges != '0' && (
                                  <>
                                    <strong>
                                      RJ Municipal Charges - {tripsettlementData.rjso_munic_charges}
                                    </strong>
                                    <br />
                                  </>
                                )}
                                {tripsettlementData.rjso_halt_charges &&
                                  tripsettlementData.rjso_halt_charges != '0' && (
                                  <>
                                    <strong>
                                      RJ Halt Charges - {tripsettlementData.rjso_halt_charges}
                                    </strong>
                                    <br />
                                  </>
                                )}
                                {tripsettlementData.rjso_en_diesel_charges &&
                                  tripsettlementData.rjso_en_diesel_charges != '0' && (
                                  <>
                                    <strong>
                                      RJ Enroute Diesel Charges - {tripsettlementData.rjso_en_diesel_charges}
                                    </strong>
                                    <br />
                                  </>
                                )}
                                {tripsettlementData.fci_atti_cooli_charges &&
                                  tripsettlementData.fci_atti_cooli_charges != '0' && (
                                  <>
                                    <strong>
                                      FCI Atti Cooli Charges - {tripsettlementData.fci_atti_cooli_charges}
                                    </strong>
                                    <br />
                                  </>
                                )}
                                {tripsettlementData.fci_extra_charges &&
                                  tripsettlementData.fci_extra_charges != '0' && (
                                  <>
                                    <strong>
                                      FCI Extra Charges - {tripsettlementData.fci_extra_charges}
                                    </strong>
                                    <br />
                                  </>
                                )}
                                {tripsettlementData.fci_office_exp_charges &&
                                  tripsettlementData.fci_office_exp_charges != '0' && (
                                  <>
                                    <strong>
                                      FCI Office Expense Charges - {tripsettlementData.fci_office_exp_charges}
                                    </strong>
                                    <br />
                                  </>
                                )}
                                {tripsettlementData.fci_gate_exp_charges &&
                                  tripsettlementData.fci_gate_exp_charges != '0' && (
                                  <>
                                    <strong>
                                      FCI Gate Expense Charges - {tripsettlementData.fci_gate_exp_charges}
                                    </strong>
                                    <br />
                                  </>
                                )}
                                {tripsettlementData.fci_weighment_charges &&
                                  tripsettlementData.fci_weighment_charges != '0' && (
                                  <>
                                    <strong>
                                      FCI Weighment Charges - {tripsettlementData.fci_weighment_charges}
                                    </strong>
                                    <br />
                                  </>
                                )}
                              </CAccordionBody>
                            </CAccordionItem>
                          </CAccordion>
                          {/* <CTableDataCell>Driver Expense</CTableDataCell> */}
                          <CTableDataCell>
                            <CFormInput
                              name="divortedPod"
                              size="sm"
                              id="formFileSm"
                              value={driver_expense_calculation()}
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableDataCell>
                            Balance{' '}
                            {rjsoInfo.length > 0
                              ? '(Total Amount - Driver Expense)'
                              : '(Advance Amount - Driver Expense)'}{' '}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              name="divortedPod"
                              size="sm"
                              id="formFileSm"
                              value={balance_amount_calculation()}
                              readOnly
                            />
                          </CTableDataCell>
                        </CTableRow>
                        {tripsettlementData.driver_balance_received && (
                          <CTableRow>
                            <CTableDataCell>Driven Balance Received </CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                name="divortedPod"
                                size="sm"
                                id="formFileSm"
                                value={tripsettlementData.driver_balance_received}
                                readOnly
                              />
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>
                    <CRow className="mt-2">
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="remarks">Expense Remarks</CFormLabel>
                        <CFormTextarea
                          value={tripsettlementData.remarks ? tripsettlementData.remarks : ''}
                          readOnly
                        ></CFormTextarea>
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="remarks">Income Remarks</CFormLabel>
                        <CFormTextarea
                          value={values.income_remarks ? values.income_remarks : ''}
                          readOnly
                        ></CFormTextarea>
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="settlement_remarks">Settlement Remarks</CFormLabel>
                        <CFormTextarea
                          name="settlement_remarks"
                          id="settlement_remarks"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          rows="1"
                          value={values.settlement_remarks}
                        ></CFormTextarea>
                      </CCol>
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="income_posting_date">
                          Income Posting Date <REQ />{' '}
                          {/* {errors.expected_return_date_time && (
                            <span className="small text-danger">
                              {errors.expected_return_date_time}
                            </span>
                          )} */}
                        </CFormLabel>
                        <CFormInput
                          size="sm"
                          type="date"
                          min={Expense_Income_Posting_Date.min_date}
                          max={Expense_Income_Posting_Date.max_date}
                          onKeyDown={(e) => {
                            e.preventDefault();
                          }}
                          id="income_posting_date"
                          name="income_posting_date"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          value={values.income_posting_date}
                        />
                      </CCol>
                    </CRow>

                    <CRow className="mt-5">
                      <CCol
                        xs={12}
                        md={6}
                        style={{ display: 'flex', width: '100%', flexDirection: 'row-reverse' }}
                      >
                        {/* <CButton
                          size="sm"
                          color="warning"
                          className="mx-3 text-white"
                          onClick={() => {
                            // setFetch(false)
                            TripsheetSettlementClosureCancel(2)
                          }}
                        >
                          Income Reject
                        </CButton>
                        <CButton
                          size="sm"
                          color="warning"
                          className="mx-3 text-white"
                          onClick={() => {
                            // setFetch(false)
                            TripsheetSettlementClosureCancel(1)
                          }}
                        >
                          Expense Reject
                        </CButton> */}
                        <CButton
                          size="sm"
                          color="warning"
                          className="mx-3 text-white"
                          onClick={() => {
                            TripsheetIncomeClosureSubmit()
                            // setSettlementSubmit(true)
                          }}
                          type="submit"
                        >
                          Submit
                        </CButton>
                      </CCol>
                    </CRow>
                  </CTabPane>
                  {/* Own Vehicles Income Capture End */}
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
                      stoTableData[stoEditIndex] ? stoTableData[stoEditIndex].sto_pod_copy : filePath
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
                {tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id === 3 && (
                  <>
                    {dieselCollectionInfo &&
                    dieselCollectionInfo.length > 0 && dieselInvoiceAttachmentVisible1Index != '' &&
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
                          dieselCollectionInfo && dieselCollectionInfo.length > 0 && dieselInvoiceAttachmentVisible1Index != ''
                            ? dieselCollectionInfo[Number(dieselInvoiceAttachmentVisible1Index)]
                                .invoice_copy
                            : ''
                        }
                      ></iframe>
                    )}
                  </>
                )}
                {tripInfo.vehicle_info && tripInfo.vehicle_info.vehicle_type_id !== 3 && (
                  <>
                    {dieselInvoiceAttachmentVisible1Index != '' && !dieselCollectionInfo[
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
                          dieselInvoiceAttachmentVisible1Index != '' ? dieselCollectionInfo[Number(dieselInvoiceAttachmentVisible1Index)].invoice_copy : ''
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
            {/* ============== Income Reject Confirm Button Modal Area ================= */}
            <CModal
              visible={settlementReject}
              backdrop="static"
              // scrollable
              onClose={() => {
                setSettlementReject(false)
              }}
            >
              <CModalBody>
                <p className="lead">
                  Are you sure to Reject the Settlement Closure ? <br />
                  {rejectionType == 1 ? '(For Expense)' : '(For Income)'}
                </p>
              </CModalBody>
              <CModalFooter>
                <CButton
                  className="m-2"
                  color="warning"
                  onClick={() => {
                    setFetch(false)

                    setSettlementReject(false)
                    addSettlementClosureRequest()
                    // removeStoFields(deliveryNoDeleteIndex)
                  }}
                >
                  Confirm
                </CButton>
                <CButton
                  color="secondary"
                  onClick={() => {
                    setSettlementReject(false)
                  }}
                >
                  Cancel
                </CButton>
              </CModalFooter>
            </CModal>
            {/* ============== Settlement Submit Confirm Button Modal Area ================= */}
            <CModal
              visible={settlementSubmit}
              backdrop="static"
              // scrollable
              onClose={() => {
                setSettlementSubmit(false)
              }}
            >
              <CModalBody>
                <p className="lead">Are you sure to Post the Income Details to SAP ?</p>
              </CModalBody>
              <CModalFooter>
                <CButton
                  className="m-2"
                  color="warning"
                  onClick={() => {
                    setSettlementSubmit(false)
                    sendAllIncomeToSAP()
                  }}
                >
                  Confirm
                </CButton>
                <CButton
                  color="secondary"
                  onClick={() => {
                    setSettlementSubmit(false)
                  }}
                >
                  Cancel
                </CButton>
              </CModalFooter>
            </CModal>
            {/* ============ RMSTO Confirm Delete Button Modal Area ================ */}
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

export default NlmtTripSheetSettlementClosure

/* Doc Type Code Description*/
// 1 - FOODS : BASE
// 2 - CONSUMER : BASE
// 3 - MMD : BASE
// 4 - IFOODS : BASE
// 5 - MINERALS : BASE
// 6 - DETERGENTS : BASE
// 7 - SERVICE : BASE
// 8 - FOODS : Additional
// 9 - CONSUMER : Additional
// 10 - MMD : Additional
// 11 - IFOODS : Additional
// 12 - MINERALS : Additional
// 13 - DETERGENTS : Additional
// 14 - SERVICE : Additional
